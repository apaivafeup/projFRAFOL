from models.projects.Cli.Cli_32 import Cli_32
from models.projects.Cli.CliBase import Cli

        
def make_cli(version, tool):
    if version == "32":
        return Cli_32(tool)
    return Cli(version, tool)
    