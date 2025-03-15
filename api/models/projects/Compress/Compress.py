from models.Project import Project

class Compress(Project):
    def __init__(self, version, tool):
        super().__init__("Compress", version, tool)
        self.available_versions = ["40", "44"]

def make_compress(version, tool):
    return Compress(version, tool)
