"""Regression checks that previously accepted drift/dimension mistakes fail."""
import copy,json,unittest
from pathlib import Path
from audit_pack import audit
R=Path(__file__).resolve().parent

class PackAuditTests(unittest.TestCase):
    def setUp(self):
        self.manifest=json.loads((R/'manifest-tuned.json').read_text())
        self.manifest['clips']={'male-sprint-right':copy.deepcopy(self.manifest['clips']['male-sprint-right'])}

    def test_detects_anchor_drift(self):
        self.manifest['clips']['male-sprint-right']['frames'][2]['anchor'][0]+=7
        errors=audit(self.manifest)['integrity_errors']
        self.assertTrue(any('drifts by 7' in e for e in errors))

    def test_detects_lying_dimensions(self):
        self.manifest['clips']['male-sprint-right']['frames'][0]['width']+=1
        self.assertTrue(any('PNG differs' in e for e in audit(self.manifest)['integrity_errors']))

    def test_registered_trial_is_still_rejected_for_game(self):
        result=audit(self.manifest)
        self.assertTrue(result['file_and_registration_passed'])
        self.assertFalse(result['game_ready'])
        self.assertEqual(result['clips'][0]['torso_drift_px'],0)

if __name__=='__main__':unittest.main()
