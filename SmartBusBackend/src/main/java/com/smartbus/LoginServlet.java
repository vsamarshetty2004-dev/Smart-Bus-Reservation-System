package com.smartbus;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request,
                           HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        if (email == null || email.trim().isEmpty()
                || password == null || password.isEmpty()) {

            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Email and password are required\"}"
            );

            return;
        }

        String sql =
                "SELECT user_id, name, email, phone, role " +
                "FROM users " +
                "WHERE email = ? AND password = ?";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, email.trim());
            statement.setString(2, password);

            try (ResultSet result = statement.executeQuery()) {

                if (result.next()) {

                    String name = escapeJson(result.getString("name"));
                    String userEmail = escapeJson(result.getString("email"));
                    String phone = escapeJson(result.getString("phone"));
                    String role = escapeJson(result.getString("role"));

                    String json =
                            "{\"success\":true," +
                            "\"message\":\"Login successful\"," +
                            "\"user\":{" +
                            "\"userId\":" + result.getInt("user_id") + "," +
                            "\"name\":\"" + name + "\"," +
                            "\"email\":\"" + userEmail + "\"," +
                            "\"phone\":\"" + phone + "\"," +
                            "\"role\":\"" + role + "\"" +
                            "}}";

                    response.getWriter().write(json);

                } else {

                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

                    response.getWriter().write(
                            "{\"success\":false,\"message\":\"Invalid email or password\"}"
                    );
                }
            }

        } catch (SQLException e) {

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Database error\"}"
            );

            e.printStackTrace();
        }
    }

    private String escapeJson(String value) {
        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}