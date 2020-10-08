# Dependencies

We need the Python firebase api https://github.com/firebase/firebase-admin-python. To install, run `pip install firebase-admin` or `sage -pip install firebase-admin`.
Make sure Sage can access this api.  Running `import firebase_admin` in Sage should not give you an error.


# Cyclic shift test
You can simply do `load('cyclic_shift_test.py')` to enable the test framework.  

We assume `firebase_admin.initialize` has been called once with `databaseURL` properly set.  I put the following code in `~/.sage/init.sage` so it's loaded once whenever Sage starts.  Then I call `init_firebase()` before `load('cyclic_shift_test.py')`

```python
def init_firebase():
  import firebase_admin
  from firebase_admin import credentials
  try:
    firebase_admin.get_app()
  except:
    firebase_admin.initialize_app(credentials.Certificate('path to a .json'), {
    'databaseURL': 'https://qtcatalan.firebaseio.com/'
    })
```
