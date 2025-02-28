import os


class Tool:

    def __init__(self, name):
        self.name = name

    def get_mutant_table_headers(self):
        raise NotImplementedError("Subclasses should implement this method")
    
    def get_mutant_table_data(self):
        raise NotImplementedError("Subclasses should implement this method")

    def run_analysis(self):
        raise NotImplementedError("Subclasses should implement this method")


    def get_mutation_summary(self):
        raise NotImplementedError("Subclasses should implement this method")

    def get_kill_matrix(self):
        raise NotImplementedError("Subclasses should implement this method")

    def get_mutants_killed_by_test(self):
        raise NotImplementedError("Subclasses should implement this method")