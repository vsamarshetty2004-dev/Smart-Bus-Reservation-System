
package com.smartbus;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebFilter("/*")
public class CorsFilter implements Filter {

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain
    ) throws IOException, ServletException {

        HttpServletRequest httpRequest =
                (HttpServletRequest) request;

        HttpServletResponse httpResponse =
                (HttpServletResponse) response;

        String origin = httpRequest.getHeader("Origin");

        // Allow the React Vite frontend
        if ("http://localhost:5173".equals(origin)
        || "http://localhost:5174".equals(origin)) { {

            httpResponse.setHeader(
                    "Access-Control-Allow-Origin", origin
            );

            httpResponse.setHeader("Vary", "Origin");

            httpResponse.setHeader(
                    "Access-Control-Allow-Methods",
                    "GET, POST, OPTIONS"
            );

            httpResponse.setHeader(
                    "Access-Control-Allow-Headers",
                    "Content-Type, Accept"
            );
        }

        // Handle browser preflight requests
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(request, response);
    }
}
}
