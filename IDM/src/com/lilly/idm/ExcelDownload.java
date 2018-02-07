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
public class ExcelDownload extends HttpServlet {
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
				LillyID = loggedInUser.getUniqueName();
				ps = connection.prepareStatement("SELECT MCMSKEY FROM IDMV_ENTRY_SIMPLE WHERE MCMSKEYVALUE = '"+LillyID+"'");
				ResultSet Idmresultset = ps.executeQuery();
				while (Idmresultset.next())
				{
					IdmID = Idmresultset.getString(1);
				} 
				ps = connection.prepareStatement("{call Z_ATTESTER_OPEN_REQUEST_DETAILED(?)}");
				ps.setString(1, IdmID);
				ResultSet resultset = ps.executeQuery();
				
				while (resultset.next()) {
					count++;
					if(count==1){
		            	json = json + "{\"LinkID\":" + "\""+ ((resultset.getString(2) == null) ? "" : resultset.getString(2)) + "\"," + "\"3\":" + "\""+ ((resultset.getString(3) == null) ? "" : resultset.getString(3)) + "\"," + "\"4\":" + "\""+ ((resultset.getString(4) == null) ? "" : resultset.getString(4)) + "\"," + "\"5\":" + "\""+ ((resultset.getString(5) == null) ? "" : resultset.getString(5)) + "\"," + "\"6\":" + "\""+ ((resultset.getString(6) == null) ? "" : resultset.getString(6)) + "\"," + "\"7\":" + "\""+ ((resultset.getString(7) == null) ? "" : resultset.getString(7)) + "\"," + "\"8\":"+ "\""+ ((resultset.getString(8) == null) ? "" : resultset.getString(8)) + "\"," + "\"9\":" + "\""+ ((resultset.getString(9) == null) ? "" : resultset.getString(9)) + "\"," + "\"10\":" + "\""+ ((resultset.getString(10) == null) ? "" : resultset.getString(10)) + "\"," + "\"11\":" + "\""+ ((resultset.getString(11) == null) ? "" : resultset.getString(11)) + "\"," + "\"12\":" + "\""+ ((resultset.getString(12) == null) ? "" : resultset.getString(12)) + "\"," + "\"13\":" + "\""+ ((resultset.getString(13) == null) ? "" : resultset.getString(13)) + "\"," + "\"14\":" + "\""+ ((resultset.getString(14) == null) ? "" : resultset.getString(14)) + "\"," + "\"15\":" + "\""+ ((resultset.getString(15) == null) ? "" : resultset.getString(15)) + "\"," + "\"16\":" + "\""+ ((resultset.getString(16) == null) ? "" : resultset.getString(16)) + "\"," + "\"17\":" + "\""+ ((resultset.getString(17) == null) ? "" : resultset.getString(17)) + "\"," + "\"18\":" + "\""+ ((resultset.getString(18) == null) ? "" : resultset.getString(18)) + "\"," + "\"19\":" + "\""+ ((resultset.getString(19) == null) ? "" : resultset.getString(19)) + "\"," + "\"20\":" + "\""+ ((resultset.getString(20) == null) ? "" : resultset.getString(20)) + "\"," + "\"21\":" + "\""+ ((resultset.getString(21) == null) ? "" : resultset.getString(21))  + "\"," + "\"22\":" + "\""+ ((resultset.getString(22) == null) ? "" : resultset.getString(22)) + "\"," + "\"23\":" + "\""+ ((resultset.getString(23) == null) ? "" : resultset.getString(23)) + "\"," + "\"24\":" + "\""+ ((resultset.getString(24) == null) ? "" : resultset.getString(24)) + "\"," + "\"25\":" + "\""+ ((resultset.getString(25) == null) ? "" : resultset.getString(25)) + "\"," + "\"26\":" + "\""+ ((resultset.getString(26) == null) ? "" : resultset.getString(26)) + "\"," + "\"27\":" + "\""+ ((resultset.getString(27) == null) ? "" : resultset.getString(27)) +"\"}";
		            }
		            else
		            {	
		            	json = json + ","+ "{\"LinkID\":" + "\""+ ((resultset.getString(2) == null) ? "" : resultset.getString(2)) + "\"," + "\"3\":" + "\""+ ((resultset.getString(3) == null) ? "" : resultset.getString(3)) + "\"," + "\"4\":" + "\""+ ((resultset.getString(4) == null) ? "" : resultset.getString(4)) + "\"," + "\"5\":" + "\""+ ((resultset.getString(5) == null) ? "" : resultset.getString(5)) + "\"," + "\"6\":" + "\""+ ((resultset.getString(6) == null) ? "" : resultset.getString(6)) + "\"," + "\"7\":" + "\""+ ((resultset.getString(7) == null) ? "" : resultset.getString(7)) + "\"," + "\"8\":"+ "\""+ ((resultset.getString(8) == null) ? "" : resultset.getString(8)) + "\"," + "\"9\":" + "\""+ ((resultset.getString(9) == null) ? "" : resultset.getString(9)) + "\"," + "\"10\":" + "\""+ ((resultset.getString(10) == null) ? "" : resultset.getString(10)) + "\"," + "\"11\":" + "\""+ ((resultset.getString(11) == null) ? "" : resultset.getString(11)) + "\"," + "\"12\":" + "\""+ ((resultset.getString(12) == null) ? "" : resultset.getString(12)) + "\"," + "\"13\":" + "\""+ ((resultset.getString(13) == null) ? "" : resultset.getString(13)) + "\"," + "\"14\":" + "\""+ ((resultset.getString(14) == null) ? "" : resultset.getString(14)) + "\"," + "\"15\":" + "\""+ ((resultset.getString(15) == null) ? "" : resultset.getString(15)) + "\"," + "\"16\":" + "\""+ ((resultset.getString(16) == null) ? "" : resultset.getString(16)) + "\"," + "\"17\":" + "\""+ ((resultset.getString(17) == null) ? "" : resultset.getString(17)) + "\"," + "\"18\":" + "\""+ ((resultset.getString(18) == null) ? "" : resultset.getString(18)) + "\"," + "\"19\":" + "\""+ ((resultset.getString(19) == null) ? "" : resultset.getString(19)) + "\"," + "\"20\":" + "\""+ ((resultset.getString(20) == null) ? "" : resultset.getString(20)) + "\"," + "\"21\":" + "\""+ ((resultset.getString(21) == null) ? "" : resultset.getString(21))  + "\"," + "\"22\":" + "\""+ ((resultset.getString(22) == null) ? "" : resultset.getString(22)) + "\"," + "\"23\":" + "\""+ ((resultset.getString(23) == null) ? "" : resultset.getString(23)) + "\"," + "\"24\":" + "\""+ ((resultset.getString(24) == null) ? "" : resultset.getString(24)) + "\"," + "\"25\":" + "\""+ ((resultset.getString(25) == null) ? "" : resultset.getString(25)) + "\"," + "\"26\":" + "\""+ ((resultset.getString(26) == null) ? "" : resultset.getString(26)) + "\"," + "\"27\":" + "\""+ ((resultset.getString(27) == null) ? "" : resultset.getString(27)) +"\"}";
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
