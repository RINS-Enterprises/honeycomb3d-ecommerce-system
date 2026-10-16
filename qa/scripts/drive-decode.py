#!/usr/bin/env python3
# QA helper: decode a saved Drive-connector download (JSON {content: base64, id, title}) into <outdir>/<id>__<title>.
# Usage: python3 -I qa/scripts/drive-decode.py <tool-result.json> <outdir>   (outdir must be outside the repo)
import sys, json, base64, hashlib, os, re
src, outdir = sys.argv[1], sys.argv[2]
d = json.load(open(src))
data = base64.b64decode(d['content'])
name = re.sub(r'[^A-Za-z0-9._ ()-]', '_', d['title'])
path = os.path.join(outdir, f"{d['id']}__{name}")
open(path, 'wb').write(data)
print(f"{d['id']}\t{d['title']}\t{len(data)}\tsha256={hashlib.sha256(data).hexdigest()}\t{path}")
