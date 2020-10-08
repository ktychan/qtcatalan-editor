from sage.combinat.dyck_word import DyckWord, DyckWords


def cyclic_shift(ws):
    """ Take a list of know Dyck words, output the next word.  
    Returns None if there's nothing more.
    """
    pass


def dumb(ws):
    """ The stupidest cyclic shift is no cyclic shift.  
    Let i = |ws|.  Return the (i+1)-th element in the default list DyckWords(n). """

    n = len(ws[0])/2
    if len(ws) == len(DyckWords(n)):
        return None
    else:
        return DyckWords(n)[len(ws)]
