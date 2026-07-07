#!/usr/bin/env python3
"""Durable strike ledger — the anti-duplicate mechanism.

STRIKES.tsv columns: name<TAB>count<TAB>chat_path<TAB>note
- strike 1: item may be retried ONCE more; if a chat_path is recorded,
  HARVEST that chat before ever re-sending.
- strike 2: auto-moved to BLOCKED.txt (needs Alexei), row kept for history.
- success: row cleared.

Usage:
  python3 strike.py add NAME [CHAT_PATH] [NOTE]   # record a failure
  python3 strike.py clear NAME                    # item succeeded
  python3 strike.py list
"""
import sys
import os
import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
TSV = os.path.join(HERE, 'STRIKES.tsv')
BLOCKED = os.path.join(HERE, 'BLOCKED.txt')


def load():
    rows = {}
    if os.path.exists(TSV):
        for ln in open(TSV):
            p = ln.rstrip('\n').split('\t')
            if len(p) >= 4 and p[0] != 'name':
                rows[p[0]] = [p[0], int(p[1]), p[2], p[3]]
    return rows


def save(rows):
    out = ['name\tcount\tchat_path\tnote']
    for r in rows.values():
        out.append('\t'.join([r[0], str(r[1]), r[2], r[3]]))
    open(TSV, 'w').write('\n'.join(out) + '\n')


def main():
    cmd = sys.argv[1]
    rows = load()
    if cmd == 'list':
        for r in rows.values():
            print('\t'.join(map(str, r)))
        return
    name = sys.argv[2]
    if cmd == 'clear':
        rows.pop(name, None)
        save(rows)
        print(f'{name}: cleared')
        return
    if cmd == 'add':
        path = sys.argv[3] if len(sys.argv) > 3 else ''
        note = sys.argv[4] if len(sys.argv) > 4 else ''
        r = rows.get(name, [name, 0, '', ''])
        r[1] += 1
        if path:
            r[2] = path
        if note:
            r[3] = note
        rows[name] = r
        save(rows)
        if r[1] >= 2:
            with open(BLOCKED, 'a') as f:
                f.write(f'{name}  # 2 strikes '
                        f'{datetime.date.today().isoformat()}: {r[3]}\n')
            print(f'{name}: strike {r[1]} -> BLOCKED (needs Alexei)')
        else:
            print(f'{name}: strike {r[1]}'
                  + (f' (harvest {r[2]} before any re-send)' if r[2] else ''))


if __name__ == '__main__':
    main()
