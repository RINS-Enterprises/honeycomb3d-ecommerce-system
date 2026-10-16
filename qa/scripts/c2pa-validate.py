#!/usr/bin/env python3
# QA helper: cryptographically validate C2PA manifests (signature, data hash) and print issuer/actions.
# Needs `pip install c2pa-python` in a QA-owned venv (never an app dependency).
# Usage: <venv>/bin/python -I qa/scripts/c2pa-validate.py <image>...
import sys, json, os, c2pa
for f in sys.argv[1:]:
    name=os.path.basename(f).split('__',1)[-1]
    try:
        mime='image/jpeg' if f.lower().endswith(('.jpg','.jpeg')) else 'image/png'
        with open(f,'rb') as fh:
            r=c2pa.Reader(mime, fh)
            st=json.loads(r.json())
        active=st.get('active_manifest'); m=st['manifests'][active]
        gen=m.get('claim_generator_info',[{}]); gen=gen[0].get('name') if isinstance(gen,list) and gen else gen
        acts=[]
        for a in m.get('assertions',[]):
            if a.get('label','').startswith('c2pa.actions'):
                for x in a['data'].get('actions',[]): acts.append((x.get('action'), (x.get('digitalSourceType') or '').rsplit('/',1)[-1], x.get('description','')[:50]))
        vs=st.get('validation_state') or ('Valid' if not st.get('validation_status') else 'Invalid')
        fails=[s.get('code') for s in (st.get('validation_status') or [])]
        issuer=(m.get('signature_info') or {}).get('issuer'); when=(m.get('signature_info') or {}).get('time')
        print(f"{name[:40]:40s} manifests={len(st['manifests'])} state={vs} failures={fails} issuer={issuer} signed={when} generator={gen} actions={acts}")
    except Exception as e:
        print(f"{name[:40]:40s} NO C2PA / error: {str(e)[:90]}")
