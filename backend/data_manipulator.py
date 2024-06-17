class DataManipulator:
    @staticmethod
    def get_sendable_data(db_data: list[dict]) -> tuple[list[str], list[list]]:
        if len(db_data) == 0:
            return [], []
        
        table_columns: list[str] = list(db_data[0].keys())
        table_data: list = [list(row.values()) for row in db_data]
        return table_columns, table_data
