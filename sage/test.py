import cyclic_shift
from cyclic_shift_test import test

if 'init_firebase' in globals():
    init_firebase()

n = 5
url = test(cyclic_shift.dumb, 5)
print(url)
