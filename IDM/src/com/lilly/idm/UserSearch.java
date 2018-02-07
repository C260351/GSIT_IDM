package com.lilly.idm;


import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.sap.idm.jmx.impl.DBConnectionManager;
import com.sap.security.api.IUser;
import com.sap.security.api.UMFactory;

//import org.json.*;
/**
 * Servlet implementation class IdmTaskCollection
 */
public class UserSearch extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	    
	}*/
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		try {
			Class.forName("com.ibm.db2.jcc.DB2Driver");
		} catch (ClassNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		Connection connection = null;
		PreparedStatement ps = null;
		String json = "[";
		int count = 0;
		String LillyID ="";
		String IdmID ="";
		connection = DBConnectionManager.getConnection();
		
		try {
			IUser loggedInUser = UMFactory.getAuthenticator().getLoggedInUser();
			if (loggedInUser != null){
				ps = connection.prepareStatement("{call Z_ATTEST_DELEGATOR_ID()}");
				ResultSet resultset = ps.executeQuery();
				
				while (resultset.next()) {
					count++;
					if(count==1){
		            	json = json + "{\"1\":" + "\""+ ((resultset.getString(1) == null) ? "" : resultset.getString(1)) + "\","  + "\"2\":" + "\""+ ((resultset.getString(2) == null) ? "" : resultset.getString(2)) +"\"}";
		            }
		            else
		            {	
		            	json = json + "," + "{\"1\":" + "\""+ ((resultset.getString(1) == null) ? "" : resultset.getString(1)) + "\","  + "\"2\":" + "\""+ ((resultset.getString(2) == null) ? "" : resultset.getString(2)) +"\"}";
		            }
				}	
			}
			else{
				json = "[{\"Error Details\": \""  + "Session expired.Login and try again" + "\"}";
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			json = "[{\"Error Code--Details\": \""  + e.getErrorCode() + "--" + e.getMessage().toString().trim() + "\"}";
		}
		finally {
		    if (ps != null) { try {
				ps.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
			} }
		}
		json = json + "]";
		
		response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	    response.getWriter().write(json);
	    
	}
	
}
