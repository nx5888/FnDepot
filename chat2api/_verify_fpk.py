"""Verify the fpk contents have the correct modifications"""
import tarfile, io, sys

fpk_path = r'D:\workspace\RTS-reference\chat2api-fpk-build\chat2api.fpk'

with tarfile.open(fpk_path, 'r:gz') as fpk:
    tmp_data = fpk.extractfile('app.tgz').read()
    with tarfile.open(fileobj=io.BytesIO(tmp_data), mode='r:gz') as app:
        print("=== Checking index-D95seZVG.js ===")
        js_data = app.extractfile('./server/public/assets/index-D95seZVG.js').read().decode('utf-8')
        checks = [
            ('handleRetry', 'Method handleRetry exists'),
            ('remountKey', 'remountKey increment'),
            ('recharts-tooltip-wrapper', 'Recharts portal cleanup'),
            ('radix-portal', 'Radix portal cleanup'),
            ('data-sonner-toaster', 'Sonner toast cleanup'),
        ]
        for token, desc in checks:
            print(f'  {"✅" if token in js_data else "❌"} {desc}')

        print("\n=== Checking index.html ===")
        html_data = app.extractfile('./server/public/index.html').read().decode('utf-8')
        print(f'  {"✅" if "portal-root" in html_data else "❌"} portal-root div')

        print("\n=== Checking Dashboard-BVDXeLnV.js ===")
        dash_data = app.extractfile('./server/public/assets/Dashboard-BVDXeLnV.js').read().decode('utf-8')
        checks2 = [
            ('_refreshVersion', 'Store has _refreshVersion'),
            ('__ver', 'Version counter variable'),
        ]
        for token, desc in checks2:
            print(f'  {"✅" if token in dash_data else "❌"} {desc}')

        print("\n✅ All checks passed!" if all(token in js_data for token, _ in checks) and
              all(token in dash_data for token, _ in checks2) and
              'portal-root' in html_data 
              else "\n❌ Some checks FAILED!")
