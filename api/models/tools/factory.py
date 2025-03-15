from models.tools.Pit import PIT
from models.tools.Major import Major

def make_tool(tool_name):
    """
    Factory method to create a Tool object based on the given tool name.

    :param tool_name: The name of the tool ("pit" or "major")
    :return: An instance of the corresponding Tool subclass
    """
    if tool_name.lower() == "pit":
        return PIT()
    elif tool_name.lower() == "major":
        return Major()
    else:
        raise ValueError(f"Unknown tool name: {tool_name}")