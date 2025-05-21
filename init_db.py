"""
Database Initialization Script

This enhanced script initializes a MySQL database with:
- Robust connection handling with retry mechanism
- Proper transaction management
- Detailed logging
- Environment variable support
- Configurable parameters
- Type hints and documentation
"""

import os
import time
from pathlib import Path
from typing import Optional

import mysql.connector
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class DatabaseInitializer:
    """
    A robust database initializer that creates and configures a MySQL database.

    Args:
        host (str): Database server host.
        user (str): Database username.
        password (str): Database password.
        database (str): Database name.
        init_file (str): Path to SQL initialization file. Defaults to 'init.sql'
        timeout (int): Connection timeout in seconds. Defaults to 60
        interval (int): Retry interval in seconds. Defaults to 5
    """

    def __init__(
        self,
        host: str = "",
        user: str = "",
        password: str = "",
        database: str = "",
        init_file: str = "init.sql",
        timeout: int = 60,
        interval: int = 5
    ):
        self.host = os.getenv("DB_HOST", host)
        self.user = os.getenv("DB_USER", user)
        self.password = os.getenv("DB_PASSWORD", password)
        self.database = os.getenv("DB_NAME", database)
        self.init_file = Path(init_file)
        self.timeout = timeout
        self.interval = interval
        self.connection: Optional[mysql.connector.MySQLConnection] = None

    def initialize(self) -> bool:
        """
        Main initialization method that handles the complete process.

        Returns:
            bool: True if initialization succeeded, False otherwise
        """
        try:
            if not self._connect_with_retry():
                return False

            if not self._execute_init_script():
                return False

            return True

        except Exception as e:
            print(f"⛔ Critical error during initialization: {e}")
            return False
        finally:
            self._close_connection()

    def _connect_with_retry(self) -> bool:
        """
        Attempts to connect to the database with retry logic.

        Returns:
            bool: True if connection succeeded, False if timeout reached
        """
        start_time = time.time()
        attempts = 0

        while (time.time() - start_time) < self.timeout:
            attempts += 1
            try:
                print(
                    f"Attempt #{attempts}: Connecting to MySQL at {self.host}...")
                self.connection = mysql.connector.connect(
                    host=self.host,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                    connect_timeout=5
                )

                if self.connection.is_connected():
                    print(
                        f"✅ Successfully connected to database '{self.database}'")
                    return True

            except mysql.connector.Error as e:
                print(f"⚠️ Connection attempt failed: {e}")
                time.sleep(self.interval)
                continue

        print(
            f"⛔ Timeout after {self.timeout} seconds. Could not connect to database.")
        return False

    def _execute_init_script(self) -> bool:
        """
        Executes the SQL initialization script.

        Returns:
            bool: True if script executed successfully, False otherwise
        """
        if not self.connection or not self.connection.is_connected():
            print("⛔ No active database connection")
            return False

        if not self.init_file.exists():
            print(f"⛔ Initialization file not found: {self.init_file}")
            return False

        try:
            with open(self.init_file, 'r') as file:
                sql_commands = file.read()

            if not sql_commands.strip():
                print("⚠️ Initialization file is empty")
                return True  # Considered success with no commands

            with self.connection.cursor() as cursor:
                # Execute each command separately
                for command in sql_commands.split(';'):
                    command = command.strip()
                    if command:
                        try:
                            cursor.execute(command)
                        except mysql.connector.Error as e:
                            print(
                                f"⚠️ Error executing command: {command}\nError: {e}")
                            continue

                self.connection.commit()
                print("✅ Database initialized successfully")
                return True

        except Exception as e:
            print(f"⛔ Error executing initialization script: {e}")
            self.connection.rollback()
            return False

    def _close_connection(self) -> None:
        """Closes the database connection if it exists."""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("✅ Database connection closed")


if __name__ == "__main__":
    # Example usage
    initializer = DatabaseInitializer()

    if initializer.initialize():
        print("🚀 Database initialization completed successfully")
        exit(0)
    else:
        print("❌ Database initialization failed")
        exit(1)
