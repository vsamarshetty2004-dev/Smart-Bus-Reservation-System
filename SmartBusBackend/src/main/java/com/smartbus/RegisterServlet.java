package com.smartbus;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@WebServlet("/api/register")
public class RegisterServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request,
                           HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String password = request.getParameter("password");

        // Basic validation
        if (name == null || name.trim().isEmpty()
                || email == null || email.trim().isEmpty()
                || password == null || password.trim().isEmpty()) {

            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Name, email and password are required\"}"
            );

            return;
        }

        String sql = "INSERT INTO users (name, email, phone, password, role) "
                   + "VALUES (?, ?, ?, ?, 'USER')";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, name.trim());
            statement.setString(2, email.trim());
            statement.setString(3, phone);
            statement.setString(4, password);

            statement.executeUpdate();

            response.setStatus(HttpServletResponse.SC_CREATED);

            response.getWriter().write(
                    "{\"success\":true,\"message\":\"Registration successful\"}"
            );

        } catch (SQLException e) {

            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Registration failed. Email may already exist\"}"
            );

            e.printStackTrace();
        }
    }
}