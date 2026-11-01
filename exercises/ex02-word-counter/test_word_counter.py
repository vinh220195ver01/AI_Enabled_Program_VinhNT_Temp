import unittest
from word_counter import count_words


class TestCountWords(unittest.TestCase):
    def test_basic(self):
        self.assertEqual(count_words("a b a"), {"a": 2, "b": 1})

    def test_case_and_punctuation(self):
        self.assertEqual(count_words("Hello, hello! World."), {"hello": 2, "world": 1})

    def test_empty(self):
        self.assertEqual(count_words(""), {})
        self.assertEqual(count_words("...  "), {})


if __name__ == "__main__":
    unittest.main()
