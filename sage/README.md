# Dependencies

We need Python the firebase api https://github.com/firebase/firebase-admin-python. To install, run `pip install firebase-admin` or `sage -pip install firebase-admin`.
Make sure Sage can access this api.  Running `import firebase_admin` in Sage should not give you an error.


# Cyclic shift test
You can simply do `load('cyclic_shift_test.py')` to enable the test framework.  

We assume `firebase_admin.initialize` has been called once with `databaseURL` properly set.  I put the following code in my `~/.sage/~` directory so it's loaded once whenever Sage starts.  Then I call `init_firebase()` before `load('cyclic_shift_test.py')`
``` python
def init_firebase():
  import firebase_admin
  from firebase_admin import credentials
  firebase_admin.initialize_app(credentials.Certificate('path to some .json file'), {
    'databaseURL': 'https://qtcatalan.firebaseio.com/'
  })
```