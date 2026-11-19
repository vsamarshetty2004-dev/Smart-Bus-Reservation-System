package com.smartbus;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static final String URL =
            "jdbc:mysql://127.0.0.1:3306/smart_bus_db"
            + "?useSSL=false"
            + "&allowPublicKeyRetrieval=true"
            + "&serverTimezone=UTC";

    private static final String USER = "root";

    // Put your actual MySQL root password here.
    private static final String PASSWORD = "mysql@123";

    public static Connection getConnection() throws SQLException {

    try {
        Class.forName("com.mysql.cj.jdbc.Driver");
    } catch (ClassNotFoundException e) {
        throw new SQLException("MySQL JDBC Driver not found", e);
    }

    return DriverManager.getConnection(URL, USER, PASSWORD);
}
    public static void main(String[] args) {

        try (Connection connection = getConnection()) {

            System.out.println("MySQL connection successful!");

        } catch (SQLException e) {

            System.out.println("MySQL connection failed.");
            e.printStackTrace();
        }
    }
}