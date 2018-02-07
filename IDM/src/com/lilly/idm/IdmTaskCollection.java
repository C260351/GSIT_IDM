package com.lilly.idm;


import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.sap.idm.jmx.impl.DBConnectionManager;
import com.sap.security.api.IUser;
import com.sap.security.api.UMFactory;

/**
 * Servlet implementation class IdmTaskCollection
 */
public class IdmTaskCollection extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
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
		String UserName = "";
		connection = DBConnectionManager.getConnection();
		
		try {
			IUser loggedInUser = UMFactory.getAuthenticator().getLoggedInUser();
			if (loggedInUser != null){
					LillyID = loggedInUser.getUniqueName();
					UserName = loggedInUser.getDisplayName();
					
					Cookie cookie = new Cookie("IDMUserName", UserName);
					
					response.addCookie(cookie);
					
					ps = connection.prepareStatement("SELECT MCMSKEY FROM IDMV_ENTRY_SIMPLE WHERE MCMSKEYVALUE = '"+LillyID+"'");
					ResultSet Idmresultset = ps.executeQuery();
					while (Idmresultset.next())
					{
						IdmID = Idmresultset.getString(1);
					} 
					ps = connection.prepareStatement("{call Z_ATTESTER_OPEN_REQUEST(?)}");
					ps.setString(1, IdmID);
					ResultSet resultset = ps.executeQuery();
			
					while (resultset.next()) {
						count++;
						if(count==1){
								//json = json + "{\"InstanceID\": " + "\"2x" +  resultset.getString(1) + "\"," + "\"LINK_ID\": " + "\"" +  resultset.getString(2) + "\"," + "\"User_ID\": " + "\""+ resultset.getString(4) + "\"," + "\"User_Name\":" + "\""+ resultset.getString(5) + "\"," + "\"Assignment_Type\":" + "\""+ resultset.getString(7) + "\"," + "\"Parent_Name\": " + "\""+ resultset.getString(6) + "\"," + " \"Valid_From\":" + "\""+ ((resultset.getString(8) == null) ? "" : resultset.getString(8)) + "\"," + "\"ValidTo\":"+ "\""+ ((resultset.getString(9) == null) ? "" : resultset.getString(9)) + "\"," + "\"ExpiryDate\":" + "\""+ resultset.getString(3) + "\"," + "\"ID\":" + "\""+ resultset.getString(10) + "\"," + "\"LastPosChng\":" + "\""+ ((resultset.getString(11) == null) ? "" : resultset.getString(11)) + "\"" +"}";
								json = json + "{\"INS\":\"" + resultset.getString(1) + "\"," + "\"LID\":" + "\"" +  resultset.getString(2) + "\"," + "\"UID\":" + "\""+ resultset.getString(4) + "\"," + "\"UN\":" + "\""+ resultset.getString(5) + "\"," + "\"AT\":" + "\""+ resultset.getString(7) + "\"," + "\"PN\":" + "\""+ resultset.getString(6) + "\"," + "\"VF\":" + "\""+ ((resultset.getString(8) == null) ? "" : resultset.getString(8)) + "\"," + "\"VT\":"+ "\""+ ((resultset.getString(9) == null) ? "" : resultset.getString(9)) + "\"," + "\"ED\":" + "\""+ resultset.getString(3) + "\"," + "\"ID\":" + "\""+ resultset.getString(10) + "\"," + "\"LPC\":" + "\""+ ((resultset.getString(11) == null) ? "" : resultset.getString(11)) + "\"" +"}";
						}
						else{	
								//json = json + ","+ "{\"InstanceID\": " + "\"2x" +  resultset.getString(1) + "\"," + "\"LINK_ID\": " + "\"" +  resultset.getString(2) + "\"," + "\"User_ID\": " + "\""+ resultset.getString(4) + "\"," + "\"User_Name\":" + "\""+ resultset.getString(5) + "\"," + "\"Assignment_Type\":" + "\""+ resultset.getString(7) + "\"," + "\"Parent_Name\": " + "\""+ resultset.getString(6) + "\"," + " \"Valid_From\":"+ "\""+ ((resultset.getString(8) == null) ? "" : resultset.getString(8)) + "\"," + "\"ValidTo\":"+ "\""+ ((resultset.getString(9) == null) ? "" : resultset.getString(9)) + "\"," + "\"ExpiryDate\":" + "\""+ resultset.getString(3) + "\"," + "\"ID\":" + "\""+ resultset.getString(10) + "\"," + "\"LastPosChng\":" + "\""+ ((resultset.getString(11) == null) ? "" : resultset.getString(11)) + "\"" +"}";
								json = json + ","+ "{\"INS\":\"" +  resultset.getString(1) + "\"," + "\"LID\":" + "\"" +  resultset.getString(2) + "\"," + "\"UID\":" + "\""+ resultset.getString(4) + "\"," + "\"UN\":" + "\""+ resultset.getString(5) + "\"," + "\"AT\":" + "\""+ resultset.getString(7) + "\"," + "\"PN\":" + "\""+ resultset.getString(6) + "\"," + "\"VF\":"+ "\""+ ((resultset.getString(8) == null) ? "" : resultset.getString(8)) + "\"," + "\"VT\":"+ "\""+ ((resultset.getString(9) == null) ? "" : resultset.getString(9)) + "\"," + "\"ED\":" + "\""+ resultset.getString(3) + "\"," + "\"ID\":" + "\""+ resultset.getString(10) + "\"," + "\"LPC\":" + "\""+ ((resultset.getString(11) == null) ? "" : resultset.getString(11)) + "\"" +"}";
						}
	           
					}
			}   	
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally {
		    if (ps != null) { try {
				ps.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} }
		}
		json = json + "]";
		
		response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	    response.getWriter().write(json);
	    

	    
	}

	 
}
