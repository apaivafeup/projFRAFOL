from models.Project import Project
from helpers import file_helper as fh

class Lang(Project):
    def __init__(self, version, tool):
        super().__init__("Lang", version, tool)
        self.available_versions = ["12","53"]

    def compile_with_defects4j(self):
        fh.comment_java_file(self.get_devsuite_path(), 96)
        super().compile_with_defects4j()

def make_lang(version, tool):
    return Lang(version, tool)
