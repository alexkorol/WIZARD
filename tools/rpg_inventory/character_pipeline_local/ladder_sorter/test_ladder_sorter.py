import os
import tempfile
import unittest
from pathlib import Path

from ladder_sorter import SorterApp


FACTIONS = ("faction_north", "faction_stonewood", "faction_dustwind", "faction_riverspill")


class LadderSorterTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        root = Path(self.temporary.name)
        self.source = root / "separate_chars"
        self.ladders = root / "ladders"
        self.source.mkdir()
        self.ladders.mkdir()
        for faction in FACTIONS:
            for axis in ("STR", "DEX", "INT"):
                for tier in (1, 2, 3):
                    (self.ladders / f"{faction} - {axis} - tier {tier}").mkdir()
            (self.ladders / f"{faction} - Misc").mkdir()

    def tearDown(self):
        self.temporary.cleanup()

    def create_numbered_batch(self, count=4):
        base_time = 1_700_000_000
        for position in range(1, count + 1):
            path = self.source / f"ChatGPT Image Jul 12, 2026, 05_24_5{position} PM ({position}).png"
            path.write_bytes(f"image-{position}".encode("ascii"))
            os.utime(path, (base_time + position, base_time + position))

    def test_four_position_batch_requires_independent_labels(self):
        self.create_numbered_batch(4)
        app = SorterApp(self.source, self.ladders)
        scan = app.scan()
        self.assertEqual(scan["stats"]["safeGroups"], 0)
        self.assertEqual(scan["stats"]["manualFiles"], 4)
        self.assertEqual(scan["stats"]["positionMetadata"], 4)
        with self.assertRaisesRegex(ValueError, "Every board must be assigned independently"):
            app.move_group("not-allowed", "DEX", 1, "")

        first = scan["unsafeItems"][0]
        result = app.move_one(first["id"], "faction_dustwind - DEX - tier 1", "test label")
        self.assertEqual(result["moved"], 1)
        self.assertEqual(len(list(self.source.glob("*.png"))), 3)
        self.assertEqual(len(list((self.ladders / "faction_dustwind - DEX - tier 1").glob("*.png"))), 1)

        undo = app.undo()
        self.assertEqual(undo["undone"], 1)
        self.assertEqual(len(list(self.source.glob("*.png"))), 4)
        self.assertTrue(app.feedback_path.exists())

    def test_six_output_batch_is_also_independent(self):
        self.create_numbered_batch(6)
        app = SorterApp(self.source, self.ladders)
        scan = app.scan()
        self.assertEqual(scan["stats"]["safeGroups"], 0)
        self.assertEqual(scan["stats"]["manualFiles"], 6)

    def test_apply_manifest_creates_review_queue_and_correction_feedback(self):
        self.create_numbered_batch(2)
        files = sorted(self.source.glob("*.png"), key=lambda path: (path.stat().st_mtime_ns, path.name.casefold()))
        assignments = Path(self.temporary.name) / "assignments.tsv"
        assignments.write_text(
            "index\tfaction\taxis\ttier\tconfidence\tnote\n"
            "1\tfaction_dustwind\tDEX\t1\thigh\tarcher kit\n"
            "2\tfaction_north\tSTR\t2\tmedium\tbronze and wool\n",
            encoding="utf-8",
        )
        source_index = Path(self.temporary.name) / "source-index.csv"
        source_index.write_text(
            "Index,Name\n" + "".join(f'{index},"{path.name}"\n' for index, path in enumerate(files, 1)),
            encoding="utf-8",
        )

        app = SorterApp(self.source, self.ladders)
        result = app.apply_assignment_manifest(assignments, source_index)
        self.assertEqual(result, {"moved": 2, "assistant_sorted": 0, "needs_review": 2, "ignored": 0})
        self.assertEqual(len(list(self.source.glob("*.png"))), 0)
        scan = app.scan()
        self.assertEqual(scan["stats"]["needsReview"], 2)
        self.assertEqual(scan["stats"]["reviewed"], 0)
        first = next(item for item in scan["reviewItems"] if item["sourceIndex"] == 1)
        self.assertEqual(first["folder"], "faction_dustwind - DEX - tier 1")

        correction = app.review_assignment(
            first["id"], "faction_stonewood - INT - tier 3", "forest ritual cues"
        )
        self.assertTrue(correction["changed"])
        corrected = next(item for item in app.scan()["reviewItems"] if item["id"] == first["id"])
        self.assertEqual(corrected["status"], "reviewed")
        self.assertEqual(corrected["folder"], "faction_stonewood - INT - tier 3")
        self.assertEqual(len(list((self.ladders / corrected["folder"]).glob("*.png"))), 1)

        app.undo()
        restored = next(item for item in app.scan()["reviewItems"] if item["id"] == first["id"])
        self.assertEqual(restored["status"], "needs_review")
        self.assertEqual(restored["folder"], "faction_dustwind - DEX - tier 1")
        feedback = app.feedback_path.read_text(encoding="utf-8")
        self.assertIn('"event": "assistant_assignment"', feedback)
        self.assertIn('"event": "review_assignment"', feedback)

    def test_ignore_removes_construct_from_ladder_and_can_be_undone(self):
        self.create_numbered_batch(1)
        source_file = next(self.source.glob("*.png"))
        assignments = Path(self.temporary.name) / "ignore-assignments.tsv"
        assignments.write_text(
            "index\tfaction\taxis\ttier\tconfidence\tnote\n"
            "1\tfaction_north\tDEX\t3\tlow\tweird construct\n",
            encoding="utf-8",
        )
        source_index = Path(self.temporary.name) / "ignore-source-index.csv"
        source_index.write_text(f'Index,Name\n1,"{source_file.name}"\n', encoding="utf-8")
        app = SorterApp(self.source, self.ladders)
        app.apply_assignment_manifest(assignments, source_index)
        review_item = app.scan()["reviewItems"][0]

        result = app.ignore_assignment(review_item["id"], "equipment construct, no character")
        self.assertEqual(result, {"ignored": 1})
        scan = app.scan()
        self.assertEqual(scan["stats"]["ignored"], 1)
        self.assertEqual(scan["stats"]["needsReview"], 0)
        ignored = scan["reviewItems"][0]
        self.assertEqual(ignored["status"], "ignored")
        self.assertIn("equipment construct", ignored["ignoreReason"])
        self.assertEqual(len(list((self.ladders / "faction_north - DEX - tier 3").glob("*.png"))), 0)
        self.assertEqual(len(list((self.ladders / ".ladder-sorter" / "ignored").glob("*.png"))), 1)

        app.undo()
        restored = app.scan()["reviewItems"][0]
        self.assertEqual(restored["status"], "needs_review")
        self.assertEqual(len(list((self.ladders / "faction_north - DEX - tier 3").glob("*.png"))), 1)
        self.assertIn('"event": "ignore_assignment"', app.feedback_path.read_text(encoding="utf-8"))

    def test_manifest_actions_and_later_batches_are_preserved(self):
        self.create_numbered_batch(3)
        assignments = Path(self.temporary.name) / "action-assignments.tsv"
        assignments.write_text(
            "index\tfaction\taxis\ttier\tconfidence\taction\tnote\n"
            "1\tfaction_north\tSTR\t2\thigh\tassign\tconfident fighter\n"
            "2\tfaction_stonewood\tDEX\t2\tmedium\treview\taxis uncertain\n"
            "3\tfaction_dustwind\tINT\t3\thigh\tignore\tobvious spirit\n",
            encoding="utf-8",
        )
        app = SorterApp(self.source, self.ladders)
        result = app.apply_assignment_manifest(assignments)
        self.assertEqual(result, {"moved": 3, "assistant_sorted": 1, "needs_review": 1, "ignored": 1})
        scan = app.scan()
        self.assertEqual(scan["stats"]["assistantSorted"], 1)
        self.assertEqual(scan["stats"]["needsReview"], 1)
        self.assertEqual(scan["stats"]["ignored"], 1)
        self.assertEqual(len(list((self.ladders / ".ladder-sorter" / "ignored").glob("*.png"))), 1)

        later = self.source / "later-character.png"
        later.write_bytes(b"later-image")
        later_assignments = Path(self.temporary.name) / "later-assignments.tsv"
        later_assignments.write_text(
            "index\tfaction\taxis\ttier\tconfidence\taction\tnote\n"
            "1\tfaction_riverspill\tDEX\t1\thigh\tassign\tlater batch\n",
            encoding="utf-8",
        )
        later_result = app.apply_assignment_manifest(later_assignments)
        self.assertEqual(later_result, {"moved": 1, "assistant_sorted": 1, "needs_review": 0, "ignored": 0})
        later_scan = app.scan()
        self.assertEqual(later_scan["stats"]["assistantAssignments"], 4)
        self.assertEqual(later_scan["stats"]["assistantSorted"], 2)


if __name__ == "__main__":
    unittest.main()
