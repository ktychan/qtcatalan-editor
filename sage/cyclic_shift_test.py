
# sage
from sage.rings.rational_field import QQ
from sage.combinat.sf.sf import SymmetricFunctions 
from sage.combinat.dyck_word import DyckWord, DyckWords

def is_chain(ws):
  """ We check if ws forms a chain by definition. """
  R = QQ['q,t']
  q,t = R.gens()
  Sym = SymmetricFunctions(R.fraction_field())
  s = Sym.s()
  return s[dinv(ws[0]), area(ws[0])].expand(2, [q,t]) == sum( q^(dinv(w))*t^(area(w)) for w in ws )

# make life easy
dinv = lambda w: w.dinv()
area = lambda w: w.area()
degree = lambda w: dinv(w) + area(w)

def chop(ws, strict=True):
  """ Decompose ws = xs + rest where xs is a maximal partial chain. 
  If strict is true but dinv(w[0]) > area(w[0]), then it returns [],ws.
  If strict is false, then xs might have length ≥ |area(w[0]) - dinv(w[0])|.

  The maximal partial chain xs is ws[:i+1] where i the smallest index such that all of the following is true
  (1) i ==area(ws[i]) - area(ws[0]),
  (2) i == dinv(ws[0]) - dinv(ws[i]), 
  (3) (not strict) or i <= dinv(xs[0]) - area(xs[0]).   # setting strict to false bypasses this criterion.
  """
  
  criteria = lambda i: all([
    i == area(ws[i]) - area(ws[0]),
    i == dinv(ws[0]) - dinv(ws[i]),
    (not strict) or i <= dinv(ws[0]) - area(ws[0])     # setting strict to false bypasses this criterion.
  ])

  for i,_ in enumerate(ws):
    if not criteria(i):
      return ws[:i], ws[i:]

  # if we haven't returned, then ws is a (partial) chain.
  return ws,[]

def decompose(ws, strict=True):
  """ Decompose ws into a set of chains by successively applying chop. 
  This depends on the order of the elements of ws.  
  
  For example, decompose([101010, 101100, 110010, 110100, 111000]) returns 
  [ 
    [ 
      [1, 0, 1, 0, 1, 0] 
    ],[ 
      [1, 0, 1, 1, 0, 0] 
    ],[ 
      [1, 1, 0, 0, 1, 0], [1, 1, 0, 1, 0, 0] 
    ],[ 
      [1, 1, 1, 0, 0, 0] 
    ]
  ]
  """
  if ws == []:
    return []

  xs,rest = chop(ws)
  if xs == ws:
    return [xs]
  else:
    if xs == []:
      return [[ws[0]]] + decompose(ws[1:], strict)
    else:
      return [xs] + decompose(rest, strict)

def serialize(w):
  """ turn a DyckWord into a JSON object. """
  return [
    [ int(x) for x in w ],
    w.area(),
    w.dinv(),
    w.bounce()
  ]
  

from firebase_admin import db
def decompose_and_upload(words):
  """ Take a set of DyckWords, decompose then upload it to firebase @ path /cyclic_shift/{n}/{random id}/...
  Returns its firebase reference path. 
  """
  if words == []:
    return "ws is empty."

  
  n = int(len(words[0])/2)
  wss = [ [serialize(w) for w in ws ] for ws in decompose(words) ]

  # we assume firebase is already initialized
  return "https://qtcatalan.web.app/" + db.reference("/experiments/cyclic_shifts/%d/" % n).push(wss).path