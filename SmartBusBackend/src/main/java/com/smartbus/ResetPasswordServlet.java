package com.smartbus;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Locale;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/reset-password")
public class ResetPasswordServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String newPassword = request.getParameter("password");

        if (email == null || email.trim().isEmpty()
                || phone == null || phone.trim().isEmpty()
                || newPassword == null || newPassword.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Email, phone number and new password are required.\"}"
            );
            return;
        }

        if (newPassword.length() < 8) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(
                    "{\"success\":false,\"message\":\"New password must contain at least 8 characters.\"}"
            );
            return;
        }

        String checkSql = "SELECT user_id FROM users WHERE LOWER(email) = ? AND phone = ?";
        String updateSql = "UPDATE users SET password = ? WHERE user_id = ?";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement checkStatement = connection.prepareStatement(checkSql)) {

            checkStatement.setString(1, email.trim().toLowerCase(Locale.ROOT));
            checkStatement.setString(2, phone.trim());

            int userId;
            try (var result = checkStatement.executeQuery()) {
                if (!result.next()) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().write(
                            "{\"success\":false,\"message\":\"The registered email and phone number do not match. Check the details and try again.\"}"
                    );
                    return;
                }
                userId = result.getInt("user_id");
            }

            try (PreparedStatement updateStatement = connection.prepareStatement(updateSql)) {
                updateStatement.setString(1, newPassword);
                updateStatement.setInt(2, userId);
                updateStatement.executeUpdate();
            }

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(
                    "{\"success\":true,\"message\":\"Password reset successful. Please log in with your new password.\"}"
            );

        } catch (SQLException e) {
            getServletContext().log("Password reset database error", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(
                    "{\"success\":false,\"message\":\"A database error occurred while resetting the password.\"}"
            );
        }
    }
}
