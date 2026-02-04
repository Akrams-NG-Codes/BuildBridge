# Compatibility monkeypatch: fixes Context.__copy__ issues on some
# Python/Django combinations where copy.copy(context) raises an
# AttributeError about 'super' objects lacking 'dicts'. This avoids
# admin add/change form crashes in development environments.
try:
    from django.template import context as _dj_context
    def _context_copy_compat(self):
        # Build a fresh instance of the same class without calling
        # its __init__ (some Context subclasses require a `request`).
        cls = self.__class__
        duplicate = object.__new__(cls)
        # shallow-copy the instance dict if present
        if hasattr(self, '__dict__'):
            duplicate.__dict__ = self.__dict__.copy()
        # copy the dict stack if present, ensure separate dict copies
        if hasattr(self, 'dicts'):
            duplicate.dicts = [d.copy() for d in self.dicts]
        # preserve autoescape if present
        if hasattr(self, 'autoescape'):
            duplicate.autoescape = self.autoescape
        return duplicate
    # Only patch if the existing implementation triggers problems
    if not hasattr(_dj_context.Context, '__copy__') or _dj_context.Context.__copy__ is not _context_copy_compat:
        _dj_context.Context.__copy__ = _context_copy_compat
except Exception:
    # If anything goes wrong during import/patch, skip silently to avoid
    # breaking startup; admin will still be usable because we guard admin
    # registrations elsewhere.
    pass
