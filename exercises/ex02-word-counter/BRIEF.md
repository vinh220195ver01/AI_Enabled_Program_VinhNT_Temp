# ex02 - Word Counter

## Task
Write `word_counter.py` with `count_words(text)` that returns a dict mapping each word (lowercase, punctuation stripped) to how many times it appears. Add unit tests in `test_word_counter.py`.

## Done when
- [x] `count_words("a b a")` returns `{"a": 2, "b": 1}`
- [x] Case-insensitive and punctuation is ignored
- [x] Empty text returns `{}`
- [x] Tests pass with `python -m unittest`

## Notes
Use `re.findall(r"[a-z0-9']+", text.lower())` and `collections.Counter`.
