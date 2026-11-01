import re
from collections import Counter


def count_words(text):
    """Return {word: count}, case-insensitive, punctuation ignored."""
    return dict(Counter(re.findall(r"[a-z0-9']+", text.lower())))
