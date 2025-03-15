import subprocess

from flask.json import jsonify
from models.projects.Cli.CliBase import Cli
from helpers import file_paths as fp

class Cli_32(Cli):

    def __init__(self, tool):
        super().__init__("32", tool)

    
    
    def compile(self):
        project = self.name_version
        cmd = ("defects4j export -p cp.test -w $HOME/" + project + "f")
        output = subprocess.check_output(cmd, shell=True, text=True)


        output = "/root/Cli-32f/target/classes:/root/Cli-32f/target/test-classes:/root/Cli-32f/file:/defects4j/framework/projects/lib/junit-4.11.jar:/defects4j/framework/projects/Cli/lib/commons-lang/commons-lang/2.1/commons-lang-2.1.jar:/defects4j/framework/projects/Cli/lib/jdepend/jdepend/2.5/jdepend-2.5.jar:/defects4j/framework/projects/Cli/lib/junit-addons/junit-addons/1.4/junit-addons-1.4.jar:/defects4j/framework/projects/Cli/lib/junit/junit/3.8.1/junit-3.8.1.jar:/defects4j/framework/projects/Cli/lib/junit/junit/3.8.2/junit-3.8.2.jar:/defects4j/framework/projects/Cli/lib/junit/junit/4.11/junit-4.11.jar:/defects4j/framework/projects/Cli/lib/junit/junit/4.12/junit-4.12.jar:/defects4j/framework/projects/Cli/lib/junit/junit/4.8.2/junit-4.8.2.jar:/defects4j/framework/projects/Cli/lib/lib/junit-addons/junit-addons/1.4/junit-addons-1.4.jar:/defects4j/framework/projects/Cli/lib/lib/junit/junit/3.8.1/junit-3.8.1.jar:/defects4j/framework/projects/Cli/lib/lib/junit/junit/3.8.2/junit-3.8.2.jar:/defects4j/framework/projects/Cli/lib/lib/junit/junit/4.11/junit-4.11.jar:/defects4j/framework/projects/Cli/lib/lib/junit/junit/4.12/junit-4.12.jar:/defects4j/framework/projects/Cli/lib/lib/junit/junit/4.8.2/junit-4.8.2.jar:/defects4j/framework/projects/Cli/lib/lib/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar:/defects4j/framework/projects/Cli/lib/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar"
    
        cmd = ["javac", "-classpath", output, fp.student_test_file_path]

        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE) 

        stdout, stderr = process.communicate()

        stdout = stdout.decode('utf-8')
        stderr = stderr.decode('utf-8')

        if process.returncode == 0:
            return jsonify({'message': "Compilation succeeded."})
        else:
            return jsonify({'message': "Compilation failed with return code: " + str(process.returncode) + "\n" + stderr})