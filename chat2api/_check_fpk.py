import tarfile, sys

fpk = sys.argv[1]
targets = ['index-D95seZVG', 'Dashboard-BVDXeLnV', 'index.html']

with tarfile.open(fpk, 'r:gz') as tar:
    # First check the tgz inside the fpk (app.tgz)
    for m in tar.getmembers():
        for t in targets:
            if t in m.name:
                print(f'{m.name}  {m.size} bytes')
    
    # Also check if there's an app.tgz inside
    try:
        app_tgz = tar.getmember('app.tgz')
        print(f'\napp.tgz inside fpk: {app_tgz.size} bytes')
        
        # Extract app.tgz to temp to check contents
        import tempfile, os
        tmp = tar.extractfile('app.tgz')
        if tmp:
            tmp_path = os.path.join(tempfile.gettempdir(), '_check_app.tgz')
            with open(tmp_path, 'wb') as f:
                f.write(tmp.read())
            
            with tarfile.open(tmp_path, 'r:gz') as app_tar:
                for m2 in app_tar.getmembers():
                    for t in targets:
                        if t in m2.name:
                            print(f'  [in app.tgz] {m2.name}  {m2.size} bytes')
            os.unlink(tmp_path)
    except KeyError:
        print('No app.tgz found in fpk')
