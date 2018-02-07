sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/resource/ResourceModel"
], function(Controller, ResourceModel) {
	"use strict";
	return Controller.extend("IDM.controller.View1", {
		onInit: function() {
			var ID = "";var LinkId = "";var UserName = "";var TaskTitle = "";var PosDate = "";var path = "";var v = "";var strUrl = "";var usrid = [];
			var ProcessedIndices = [];var result = "";var selectedRowPage = "";var selectedRowIndex = "";var RecDwnld = [];var TotalRecords = "";var counter = "";
			var Selpath = "";var sText = "";var oModelAction;var comment = "";var gAction = "";var gDelegate = "";var progess = 0;var Selvalue = new Object();var SelKey = "";
			jQuery.sap.require("sap.ui.core.IconPool");
			var oTable = new sap.ui.table.Table("oTable", {
				visibleRowCount: 6,
				firstVisibleRow: 2,
				editable: false,
				selectionBehavior: sap.ui.table.SelectionBehavior.RowSelector,
				enableColumnFreeze: false,
				selectionMode: sap.ui.table.SelectionMode.MultiToggle,
				enableBusyIndicator: true,
				navigationMode: sap.ui.table.NavigationMode.Paginator,
				threshold: 9999,
				filter: function(oControlEvent) {
					selectedRowPage = "";
					selectedRowIndex = "";
					fnPaintRows();
					document.getElementById("details").style.visibility = "hidden";
					document.getElementById("userdetails").style.visibility = "hidden";
				},
				sort: function(oControlEvent) {
					selectedRowPage = "";
					selectedRowIndex = "";
					fnPaintRows();
					document.getElementById("details").style.visibility = "hidden";
					document.getElementById("userdetails").style.visibility = "hidden";
				},
				cellClick: function(oControlEvent) {
					if (oTable.getContextByIndex(oControlEvent.getParameter("rowIndex"))) {
						selectedRowPage = oTable._oPaginator.getCurrentPage();
						selectedRowIndex = oControlEvent.getParameter("cellControl").sId.split("-")[2].substring(3);
						fnPaintRows();
						path = oTable.getContextByIndex(oControlEvent.getParameter("rowIndex")).getPath();
						v = oTable.getModel().getProperty(path);
						ID = v.ID;
						LinkId = v.LID;
						UserName = v.UN;
						TaskTitle = v.PN;
						PosDate = v.LPC;
						if (ID != "") {
							sap.ui.getCore().byId("oRtreeTable").setBusy(true);
							sap.ui.getCore().byId("oLtreeTable").setBusy(true);
							sap.ui.getCore().byId("oReviewTable").setBusy(true);
							fnLoadDetails(ID, LinkId, UserName, TaskTitle, PosDate);
							document.getElementById("details").style.visibility = "visible";
							document.getElementById("userdetails").style.visibility = "visible";
						}
					} else {
						selectedRowPage = "";
						selectedRowIndex = "";
						fnPaintRows();
						document.getElementById("details").style.visibility = "hidden";
						document.getElementById("userdetails").style.visibility = "hidden";
					}
				},
				toolbar: new sap.m.Toolbar({
					content: [
						new sap.ui.commons.Button({
							text: "Access is appropriate",
							icon: sap.ui.core.IconPool.getIconURI("employee-approvals"),
							style: sap.ui.commons.ButtonStyle.Accept,
							press: function() {
								if (oTable.getBinding("rows").getLength() > 0) {
									var SelRows = oTable.getSelectedIndices();
									if (SelRows.length > 0) {
										var ApproveDialog = new sap.m.Dialog("ApproveDialog", {
											title: 'Confirm',
											type: 'Message',
											content: [
												new sap.m.Text({
													text: 'Comment: '
												}),
												new sap.m.TextArea('submitDialogTextarea', {
													maxLength: 800,
													liveChange: function(oEvent) {
														var sText = oEvent.getParameter('value');
														var parent = oEvent.getSource().getParent();
														parent.getBeginButton().setEnabled(sText.length > 0);
													},
													width: '100%',
													placeholder: 'Add note (required)'
												}),
												new sap.m.Text({
													text: 'Are you sure you want to approve?'
												}),
												new sap.ui.commons.ProgressIndicator("CERTIFY", {
													width: "100%",
													visible: false
												})
											],
											beginButton: new sap.m.Button({
												text: 'Submit',
												enabled: false,
												press: function(oControlEvent) {
													sap.ui.getCore().byId(oControlEvent.getSource().getId()).setEnabled(false);
													sap.ui.getCore().byId("btnCancel").setEnabled(false);
													sap.ui.getCore().byId('submitDialogTextarea').setEnabled(false);
													Selpath = "";
													ProcessedIndices = [];
													result = "";
													Selvalue = new Object();
													counter = 0;
													sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();
													sText = sText.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
													oModelAction = new sap.ui.model.odata.ODataModel("/idmrestapi/v2/service", true); //,null,null,{},true,false,false,true
													oModelAction.refreshSecurityToken();
													TotalRecords = SelRows.length;

													gAction = "CERTIFY";
													gDelegate = "";
													progess = 0;
													sap.ui.getCore().byId("CERTIFY").setVisible(true);
													fnAction();
												}
											}),
											endButton: new sap.m.Button("btnCancel", {
												text: 'Cancel',
												press: function() {
													ApproveDialog.close();
												}
											}),
											afterClose: function(oControlEvent) {
												if (oControlEvent.getParameter("origin").sId != "btnCancel") {
													if (result == "Error") {
														sap.m.MessageToast.show('Error occurred.Contact support.', {
															duration: 2000,
															at: "center center"
														});
													} else {
														sap.m.MessageToast.show('All records attested', {
															duration: 2000,
															at: "center center"
														});
													}
												}
												ApproveDialog.destroy();
											}
										});
										ApproveDialog.open();
									} else {
										sap.m.MessageToast.show("Please select at least one row", {
											collision: "fit fit",
											width: "20em",
											at: "center center"
										});
									}
								}
							}
						}),
						new sap.ui.commons.Button({
							text: "Remove Access",
							icon: sap.ui.core.IconPool.getIconURI("employee-rejections"),
							style: sap.ui.commons.ButtonStyle.Reject,
							press: function() {
								if (oTable.getBinding("rows").getLength() > 0) {
									var SelRows = oTable.getSelectedIndices();
									if (SelRows.length > 0) {
										var RejectDialog = new sap.m.Dialog("RejectDialog", {
											title: 'Remove Access',
											type: 'Message',
											content: [
												new sap.m.MessageStrip({
													text: "Note: Access will be removed immediately.",
													showIcon: true,
													class: "sapUiMediumMarginBottom"
												}),
												new sap.m.Text({
													text: 'Comment: '
												}),
												new sap.m.TextArea('submitDialogTextarea2', {
													maxLength: 800,
													liveChange: function(oEvent) {
														var sText = oEvent.getParameter('value');
														var parent = oEvent.getSource().getParent();
														parent.getBeginButton().setEnabled(sText.length > 0);
													},
													width: '100%',
													placeholder: 'Add note (required)'
												}),
												new sap.m.Text({
													text: 'Are you sure you want to remove access? '
												}),
												new sap.ui.commons.ProgressIndicator("REJECT", {
													width: "100%",
													visible: false
												})
											],
											beginButton: new sap.m.Button({
												text: 'Submit',
												enabled: false,
												press: function(oControlEvent) {
													sap.ui.getCore().byId(oControlEvent.getSource().getId()).setEnabled(false);
													sap.ui.getCore().byId("btnCancel").setEnabled(false);
													sap.ui.getCore().byId('submitDialogTextarea2').setEnabled(false);
													var Selpath = "";
													result = "";
													var Selvalue = new Object();
													ProcessedIndices = [];
													counter = 0;
													sText = sap.ui.getCore().byId('submitDialogTextarea2').getValue();
													sText = sText.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
													oModelAction = new sap.ui.model.odata.ODataModel("/idmrestapi/v2/service", true); //,null,null,{},true,false,false,true
													oModelAction.refreshSecurityToken();
													TotalRecords = SelRows.length;
													gAction = "REJECT";
													gDelegate = "";
													progess = 0;
													sap.ui.getCore().byId("REJECT").setVisible(true);
													fnAction();

												}
											}),
											endButton: new sap.m.Button("btnCancel", {
												text: 'Cancel',
												press: function() {
													RejectDialog.close();
												}
											}),
											afterClose: function(oControlEvent) {
												if (oControlEvent.getParameter("origin").sId != "btnCancel") {
													if (result == "Error") {
														sap.m.MessageToast.show('Error occurred.Contact support.', {
															duration: 2000,
															at: "center center"
														});
													} else {
														sap.m.MessageToast.show('Access removed', {
															duration: 2000,
															at: "center center"
														});
													}
												}
												RejectDialog.destroy();
											}
										});
										RejectDialog.open();
									} else {
										sap.m.MessageToast.show("Please select at least one row", {
											collision: "fit fit",
											width: "20em",
											at: "center center"
										});
									}
								}
							}
						}),
						new sap.ui.commons.Button({
							text: "Delegate Request",
							icon: sap.ui.core.IconPool.getIconURI("share"),
							style: sap.ui.commons.ButtonStyle.Emph,
							press: function() {
								if (oTable.getBinding("rows").getLength() > 0) {
									var SelRows = oTable.getSelectedIndices();
									if (SelRows.length > 0) {
												var AutoCtrl;
												var oModelPerson = new sap.ui.model.odata.ODataModel('/idmrestapi/v2/service', true);
												var DelegateDialog = new sap.m.Dialog("DelegateDialog", {
													title: "Delegate User",
													contentWidth: "200px",
													contentHeight: "180px",
													resizeable: true,
													type: "Message",
													content: [
														new sap.m.MessageStrip("ErrInfo", {
															text: "Please select a valid User ID",
															showIcon: true,
															visible: false,
															class: "sapUiLargeMarginTopBottom",
															type: "Error"
														}),
														new sap.m.Label({
															text: "Select a user : "
														}),
														AutoCtrl = new sap.ui.commons.AutoComplete("UsrAutoCmp", {
															tooltip: "Enter a name or Lilly ID",
															width: "275px",
															maxPopupItems: 15,
															displaySecondaryValues: true,
															suggest: function(oEvent) {
																oModelPerson.destroy();
																oModelPerson = new sap.ui.model.odata.ODataModel('/idmrestapi/v2/service', true);
																var sValue = oEvent.getParameter("suggestValue");
																usrid = [];
																AutoCtrl.destroyItems();
																sap.ui.getCore().byId("ErrInfo").setVisible(false);
																if (sValue.length > 2 && sValue != "") {
																	oModelPerson.read("/ET_MX_PERSON?", null, "filterBasic=" + sValue +
																		"*&$format=json&$select=SV_DISPLAYNAME,SV_MSKEYVALUE,ID", false,
																		function(oData, oResponse) {
																			var Len = oData.results.length;
																			if (Len > 0) {
																				if (Len > 15) Len = 15;
																				for (var i = 0; i < Len; i++) {
																					AutoCtrl.addItem(new sap.ui.core.ListItem({
																						text: oData.results[i].SV_DISPLAYNAME,
																						additionalText: oData.results[i].SV_MSKEYVALUE
																					}));
																					usrid.push({
																						lillyid: oData.results[i].SV_MSKEYVALUE,
																						idmid: oData.results[i].ID
																					});
																				}
																			}
																		},
																		function(oError) {
																			jQuery.sap.log.error(oError);
																		}
																	);
																}
															},
															liveChange: function(oEvent) {
																sap.ui.getCore().byId("ErrInfo").setVisible(false);
																var val = oEvent.getParameter("liveValue");
																var parent = oEvent.getSource().getParent();
																parent.getBeginButton().setEnabled(val.length > 0 && sap.ui.getCore().byId('submitDialogTextarea3').getValue()
																	.length > 0);
															}
														}),
														new sap.m.TextArea('submitDialogTextarea3', {
															maxLength: 800,
															liveChange: function(oEvent) {
																var parent = oEvent.getSource().getParent();
																parent.getBeginButton().setEnabled(oEvent.getParameter('value').length > 0 && sap.ui.getCore().byId(
																	'UsrAutoCmp').getValue().length > 0);
															},
															width: '100%',
															placeholder: 'Add note (required)'
														}),
														new sap.m.Text({
															text: 'Are you sure you want to delegate? '
														}),
														new sap.ui.commons.ProgressIndicator("DELEGATE", {
															width: "100%",
															visible: false
														})
													],
													beginButton: new sap.m.Button("BtnDelg", {
														text: 'Delegate',
														enabled: false,
														press: function(oControlEvent) {
															sap.ui.getCore().byId(oControlEvent.getSource().getId()).setEnabled(false);
															sap.ui.getCore().byId("btnCancel").setEnabled(false);
															sap.ui.getCore().byId('UsrAutoCmp').setEnabled(false);
															sap.ui.getCore().byId('submitDialogTextarea3').setEnabled(false);
															var Selpath = "";
															var Selvalue = new Object();
															result = "";
															var aText = "";
															var idmID = "";
															ProcessedIndices = [];
															counter = 0;
															var ObjCtrl = sap.ui.getCore().byId('UsrAutoCmp');
															var ObjSel = sap.ui.getCore().byId(ObjCtrl.mProperties.selectedItemId);
															if (ObjSel) aText = ObjSel.mProperties.additionalText;
															for (var u = 0; u < usrid.length; u++) {
																if (usrid[u].lillyid.toUpperCase() == aText.toUpperCase()) {
																	idmID = usrid[u].idmid;
																	break;
																}
															}
															if (idmID > 0) {
																oModelAction = new sap.ui.model.odata.ODataModel("/idmrestapi/v2/service", true); //,null,null,{},true,false,false,true
																oModelAction.refreshSecurityToken();
																TotalRecords = SelRows.length;
																sText = sap.ui.getCore().byId('submitDialogTextarea3').getValue();
																sText = sText.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
																gAction = "DELEGATE";
																gDelegate = idmID;
																progess = 0;
																sap.ui.getCore().byId("DELEGATE").setVisible(true);
																fnAction();
															} else {
																sap.ui.getCore().byId("ErrInfo").setVisible(true);
																sap.ui.getCore().byId("btnCancel").setEnabled(true);
																sap.ui.getCore().byId('UsrAutoCmp').setEnabled(true);
																sap.ui.getCore().byId('submitDialogTextarea3').setEnabled(true);
															}
														}
													}),
													endButton: new sap.m.Button("btnCancel", {
														text: 'Cancel',
														press: function() {
															DelegateDialog.close();
														}
													}),
													afterClose: function(oControlEvent) {
														if (oControlEvent.getParameter("origin").sId != "btnCancel") {
															if (result == "Error") {
																sap.m.MessageToast.show('Error occurred.Contact support.', {
																	duration: 2000,
																	at: "center center"
																});
															} else {
																sap.m.MessageToast.show('Delegation successful', {
																	duration: 2000,
																	at: "center center"
																});
															}
														}
														DelegateDialog.destroy();
													}
												});
												AutoCtrl.setFilterFunction(function(sValue, oItem) {
													return jQuery.sap.startsWithIgnoreCase(oItem.getText(), sValue) || jQuery.sap.startsWithIgnoreCase(oItem.getAdditionalText(),
														sValue);
												});
												DelegateDialog.open();
												sap.ui.getCore().byId("UsrAutoCmp").attachBrowserEvent("keypress", function(e) {
													if(e.keyCode==42) e.preventDefault();
												});
												
									} else {
										sap.m.MessageToast.show("Please select at least one row", {
											collision: "fit fit",
											width: "20em",
											at: "center center"
										});
									}
								}
							}
						}),
						new sap.ui.commons.Button({
							text: "Download",
							width: "140px",
							icon: sap.ui.core.IconPool.getIconURI("download"),
							press: function() {
								if (oTable.getBinding("rows").getLength() > 0) {
									var Sp = "";
									var Sv = "";
									RecDwnld = [];
									var busyDialog = new sap.m.BusyDialog({
										text: "Downloading...",
										showCancelButton: false
									});
									busyDialog.open();
									for (var d = 0; d < oTable.getSelectedIndices().length; d++) {
										Sp = oTable.getContextByIndex(oTable.getSelectedIndices()[d]).getPath();
										Sv = oTable.getModel().getProperty(Sp);
										RecDwnld.push(Sv.LID);
									}
									$.ajax({
										type: 'GET',
										url: "/IDM/ExcelDownload",
										async: true,
										success: function(oData) {
											if (oData.length > 0) {
												JSONToCSVConvertor(oData, RecDwnld, "Data.csv", true, busyDialog);
											} else {
												sap.m.MessageToast.show("No Records found.", {
													collision: "fit fit",
													at: "center center",
													duration: 2000
												});
												busyDialog.close();
											}
										},
										error: function(data, status, er) {
											jQuery.sap.log.error("status: " + status + " Reason:" + er);
											busyDialog.close();
										}
									});
								}
							}
						}),
						new sap.ui.commons.TextField("txtFilter",({
							text: "",
							tooltip: "Keyword(s) to filter",
							width: "140px"
						})),
						new sap.ui.commons.DropdownBox("DropdownColumn",{
							tooltip: "Column Name",
							items: [
							        new sap.ui.core.ListItem({text: "-Select-", key: ""}),
							        new sap.ui.core.ListItem({text: "User ID", key: "UID"}),
							        new sap.ui.core.ListItem({text: "User Name", key: "UN"}),
							        new sap.ui.core.ListItem({text: "Assignment Type", key: "AT"}),
							        new sap.ui.core.ListItem({text: "Parent Name", key: "PN"}),
							        new sap.ui.core.ListItem({text: "Valid From", key: "VF"}),
							        new sap.ui.core.ListItem({text: "Valid To", key: "VT"}),
							        new sap.ui.core.ListItem({text: "Request Expires", key: "ED"})],
							change: function(oEvent){
								SelKey = oEvent.oSource.getSelectedKey();
								//sap.ui.getCore().byId("TextFieldId").setValue(oEvent.oSource.getSelectedItemId());
								}
						}),
						new sap.ui.commons.Button("btnFilter",({
							text: "Search",
							press: function(){
							
							if(SelKey!="")
							{
									//Customer filter
									var binding = oTable.getBinding("rows");
									var enabledFilters = binding.aFilters;
									// build filter array
									var aFilter = [];
									var sQuery = sap.ui.getCore().byId("txtFilter").getValue().trim();
									var count = occurrences(sQuery,"*");
									var strings = sQuery.split("*");
									if(SelKey!="" && sQuery.length!=0)
									{
										if(count==0)  //No wildcard
										{
											aFilter.push(new sap.ui.model.Filter(SelKey, sap.ui.model.FilterOperator.StartsWith, sQuery));
										}	
										else if(count==1) //Single wildcard 
										{
											if(sQuery=="*") //ex: *
											{
												aFilter.push(new sap.ui.model.Filter(SelKey, sap.ui.model.FilterOperator.NE, sQuery));
											}
											else //ex: *d
											{
												if(sQuery.indexOf("*")==0 && strings[1].trim()!="")  //* occurs first
													{
														aFilter.push(new sap.ui.model.Filter(SelKey, sap.ui.model.FilterOperator.EndsWith, strings[1].trim()));
													}
												else //ex: a* or a*b
													{
														if(strings[0].trim()!="")aFilter.push(new sap.ui.model.Filter(SelKey, sap.ui.model.FilterOperator.StartsWith, strings[0].trim()));
														if(strings[1].trim()!="")aFilter.push(new sap.ui.model.Filter(SelKey, sap.ui.model.FilterOperator.EndsWith, strings[1].trim()));
													}
											}
										}
										else if(count>1) //Multiple wildcard 
										{
											if(sQuery.indexOf("*")==0) //*De*rr* or *De*rr 
											{
												for(var i = 1, length = strings.length; i < length; i++)
												{
														if(strings[i].trim()!="" && i == length-1)
														{	
															aFilter.push(new sap.ui.model.Filter(SelKey, sap.ui.model.FilterOperator.EndsWith, strings[i].trim()));
														}
														else if(strings[i].trim()!="")
														{
															aFilter.push(new sap.ui.model.Filter(SelKey, sap.ui.model.FilterOperator.Contains, strings[i].trim()));	
														}	
												}
											}
											else //ex:  De*rr*tt or De*rr*tt*
											{
												for(var i = 0, length = strings.length; i < length; i++)
												{
													if(i==0)
													{
														if(strings[0].trim()!="")aFilter.push(new sap.ui.model.Filter(SelKey, sap.ui.model.FilterOperator.StartsWith, strings[0].trim()));
													}
													else
													{
														if(strings[i].trim()!="" && i == length-1)
														{	
															aFilter.push(new sap.ui.model.Filter(SelKey, sap.ui.model.FilterOperator.EndsWith, strings[i].trim()));
														}
														else if(strings[i].trim()!="")
														{
															aFilter.push(new sap.ui.model.Filter(SelKey, sap.ui.model.FilterOperator.Contains, strings[i].trim()));	
														}	
													}	
												}
											}
										}
									}
									if(aFilter.length > 0)
									{
										sap.ui.getCore().byId(SelKey).setFiltered(true);
									}
									
									var temp =[];
									if(enabledFilters.length > 0)
									{
										temp = enabledFilters[0].aFilters;
										for(var i=0;i<temp.length;i++)
										{
											if(temp[i].sPath==SelKey && sQuery=="")
											{ 
												//remove the filter flag
												sap.ui.getCore().byId(SelKey).setFiltered(false);
											}
											else if(temp[i].sPath!=SelKey)
											{
												//retain the old filter
												aFilter.push(temp[i]);	
											}
										}	
									}	
									
									if(aFilter.length > 0)
									{
										binding.filter([ new sap.ui.model.Filter( aFilter, true) ]);
										//clear 
										selectedRowPage = "";
										selectedRowIndex = "";
										fnPaintRows();
										document.getElementById("details").style.visibility = "hidden";
										document.getElementById("userdetails").style.visibility = "hidden";
									}
									else
									{
										binding.filter();
										//clear 
										selectedRowPage = "";
										selectedRowIndex = "";
										fnPaintRows();
										document.getElementById("details").style.visibility = "hidden";
										document.getElementById("userdetails").style.visibility = "hidden";
									}	
								}
							else
							{
								//Pop up user to select a column
								sap.m.MessageToast.show("Please choose a Column Name", {
									collision: "fit fit",
									at: "center center",
									width: "20em",
									duration: 2000
								});
							}
							}
						})),
						new sap.ui.commons.Button("reset",({
							text: "Reset",
							press: function(){
								SelKey="";
								oTable.getBinding("rows").filter();
								sap.ui.getCore().byId("txtFilter").setValue("");
								sap.ui.getCore().byId("DropdownColumn").setSelectedKey("");
								sap.ui.getCore().byId("UID").setFiltered(false);
								sap.ui.getCore().byId("UN").setFiltered(false);
								sap.ui.getCore().byId("AT").setFiltered(false);
								sap.ui.getCore().byId("PN").setFiltered(false);
								sap.ui.getCore().byId("VF").setFiltered(false);
								sap.ui.getCore().byId("VT").setFiltered(false);
								sap.ui.getCore().byId("ED").setFiltered(false);
								//clear Detail section
								selectedRowPage = "";
								selectedRowIndex = "";
								fnPaintRows();
								document.getElementById("details").style.visibility = "hidden";
								document.getElementById("userdetails").style.visibility = "hidden";
							}
						})),
						new sap.ui.commons.Label({
							text: "Ref Links: "
							//,
							//width: "175px",
							//textAlign: sap.ui.core.TextAlign.Right
						}),
						new sap.m.Link({
							text: "HR Role",
							href: "http://lillynet.global.lilly.com/sites/GBIPKnowledgeCenter/Wiki%20Uploaded%20Attachments/HR%20Periodic%20Review.xlsx",
							target: "_self"
						}),
						new sap.m.ToolbarSeparator({}),
						new sap.m.Link({
							text: "V&C Finance",
							href: "http://lillynet.global.lilly.com/sites/VCBPKCSECURITYTEAMSITE/Instructional%20and%20Training%20Documents%20Library/Finance%20Role%20Description.xlsx",
							target: "_self"
						}),
						new sap.m.ToolbarSeparator({}),
						new sap.m.Link({
							text: "SCM",
							href: "http://lillynet.global.lilly.com/sites/GSCFrontDoor/BusinessProcesses/Security/SAP%20Roles%20-%20Overview.aspx",
							target: "_blank"
						})
					]
				})
			});
			//Define the columns and the control templates to be used
			oTable.addColumn(new sap.ui.table.Column("UID",{
				label: new sap.ui.commons.Label({
					text: "User ID"
				}),
				template: new sap.ui.commons.TextView({
					editable: false
				}).bindProperty("text", "UID"),
				sortProperty: "UID"
				//,
				//filterProperty: "UID"
			}));
			oTable.addColumn(new sap.ui.table.Column("UN",{
				label: new sap.ui.commons.Label({
					text: "User Name"
				}),
				template: new sap.ui.commons.TextView({
					editable: false
				}).bindProperty("text", "UN"),
				sortProperty: "UN"
				//,
				//filterProperty: "UN"
			}));
			oTable.addColumn(new sap.ui.table.Column("AT",{
				label: new sap.ui.commons.Label({
					text: "Assignment Type"
				}),
				template: new sap.ui.commons.TextView({
					editable: false
				}).bindProperty("text", "AT"),
				sortProperty: "AT"
				//,
				//filterProperty: "AT"
			}));
			oTable.addColumn(new sap.ui.table.Column("PN",{
				label: new sap.ui.commons.Label({
					text: "Parent Name"
				}),
				template: new sap.ui.commons.TextView({
					editable: false
				}).bindProperty("text", "PN"),
				sortProperty: "PN"
				//,
				//filterProperty: "PN"
			}));
			oTable.addColumn(new sap.ui.table.Column("VF",{
				label: new sap.ui.commons.Label({
					text: "Valid From"
				}),
				template: new sap.ui.commons.TextView({
					editable: false
				}).bindProperty("text", "VF"),
				sortProperty: "VF"
				//,
				//filterProperty: "VF"
			}));
			oTable.addColumn(new sap.ui.table.Column("VT",{
				label: new sap.ui.commons.Label({
					text: "Valid To"
				}),
				template: new sap.ui.commons.TextView({
					editable: false
				}).bindProperty("text", "VT"),
				sortProperty: "VT"
				//,
				//filterProperty: "VT"
			}));
			oTable.addColumn(new sap.ui.table.Column("ED",{
				label: new sap.ui.commons.Label({
					text: "Request Expires"
				}),
				template: new sap.ui.commons.TextView({
					editable: false
				}).bindProperty("text", "ED"),
				sortProperty: "ED"
				//,
				//filterProperty: "ED"
			}));
			oTable.addColumn(new sap.ui.table.Column({
				label: new sap.ui.commons.Label({
					text: "LinkID"
				}),
				template: new sap.ui.commons.TextView({
					editable: false
				}).bindProperty("text", "LID"),
				visible: false
			}));
			oTable.addColumn(new sap.ui.table.Column({
				label: new sap.ui.commons.Label({
					text: "InstanceID"
				}),
				template: new sap.ui.commons.TextView({
					editable: false
				}).bindProperty("text", "INS"),
				visible: false
			}));
			oTable.addColumn(new sap.ui.table.Column({
				label: new sap.ui.commons.Label({
					text: "ID"
				}),
				template: new sap.ui.commons.TextView({
					editable: false
				}).bindProperty("text", "ID"),
				visible: false
			}));
			oTable.addColumn(new sap.ui.table.Column({
				label: new sap.ui.commons.Label({
					text: "LastPosChng"
				}),
				template: new sap.ui.commons.TextView({
					editable: false
				}).bindProperty("text", "LPC"),
				visible: false
			}));
			var oLayout = new sap.ui.layout.VerticalLayout({
				content: [oTable]
			});
			oLayout.addStyleClass("sapUiSizeCompact");
			oLayout.placeAt("mycontent");
			oTable.setBusy(true);
			var lblName = new sap.m.Label("LoggedUser", {
				text: ""
			});
			var btnLogout = new sap.m.Button("btnLogout", {
				press: function() {
					$.post('/idmui5/LogoutServlet', function(data) {
						document.cookie = "IDMUserName=";
						window.location.reload(true);
					});
				},
				icon: sap.ui.core.IconPool.getIconURI("log")
			});
			btnLogout.setTooltip("Logout");
			var mWLayout = new sap.ui.layout.HorizontalLayout({
				content: [lblName, btnLogout]
			});
			mWLayout.placeAt("CtrlDisplayName");
			fnLoadMainTable();
			fnUserDetails();
			var oDetMatrix = new sap.ui.commons.layout.MatrixLayout('oDetMatrix', {
				coulmns: 3,
				widths: ["25%", "30%", "45%"]
			});
			var oDetRow = new sap.ui.commons.layout.MatrixLayoutRow({
				id: "DetRow-1"
			});
			oDetMatrix.addRow(oDetRow);
			var oDetCell = new sap.ui.commons.layout.MatrixLayoutCell({
				id: 'DCell-1-1',
				vAlign: sap.ui.commons.layout.VAlign.Top,
				padding: sap.ui.commons.layout.Padding.Both,
				backgroundDesign: sap.ui.commons.layout.BackgroundDesign.Transparent
			});
			oDetCell.addContent(fnCreateLeftTree());
			oDetRow.addCell(oDetCell);
			oDetCell = new sap.ui.commons.layout.MatrixLayoutCell({
				id: 'DCell-1-2',
				vAlign: sap.ui.commons.layout.VAlign.Top,
				padding: sap.ui.commons.layout.Padding.Both,
				backgroundDesign: sap.ui.commons.layout.BackgroundDesign.Transparent
			});
			oDetCell.addContent(fnCreateMiddleTable());
			oDetRow.addCell(oDetCell);
			oDetCell = new sap.ui.commons.layout.MatrixLayoutCell({
				id: 'DCell-1-3',
				vAlign: sap.ui.commons.layout.VAlign.Top,
				padding: sap.ui.commons.layout.Padding.Both,
				backgroundDesign: sap.ui.commons.layout.BackgroundDesign.Transparent
			});
			oDetCell.addContent(fnCreateRightTree());
			oDetRow.addCell(oDetCell);
			oDetMatrix.placeAt("details");

			function fnAction() {
				strUrl = "";
				Selpath = oTable.getContextByIndex(oTable.getSelectedIndices()[counter]).getPath();
				Selvalue = oTable.getModel().getProperty(Selpath);
				//Execute the REST api with the string formed above.	
				if (gAction == "CERTIFY") {
					strUrl = "/Decision?InstanceID='2x" + Selvalue.INS + "'&SAP__Origin='IDM'" +
						"&DecisionKey='ATTEST'&Action='CERTIFY'&LinkId='" + Selvalue.LID + "'&Comments='" + sText + "'";
				} else if (gAction == "REJECT") {
					strUrl = "/Decision?InstanceID='2x" + Selvalue.INS + "'&SAP__Origin='IDM'" +
						"&DecisionKey='ATTEST'&Action='REJECT'&LinkId='" + Selvalue.LID + "'&Comments='" + sText + "'";
				} else if (gAction == "DELEGATE") {
					strUrl = "/Decision?InstanceID='2x" + Selvalue.INS + "'&SAP__Origin='IDM'" +
						"&DecisionKey='DELEGATE'&DelegateId='" + gDelegate + "'&LinkId='" + Selvalue.LID + "'&Comments='" + sText + "'";
				}
				if (strUrl != "") {
					oModelAction.create(strUrl, null, null,
						function() {
							//Array to store processed rows.	
							ProcessedIndices.push(Selvalue);
							counter++;
							try {
								//Progress bar indicator
								progess = Math.round(((counter / TotalRecords) * 100));
								sap.ui.getCore().byId(gAction).setDisplayValue("Completed " + progess + "%");
								sap.ui.getCore().byId(gAction).setPercentValue(progess);
							} catch (err) {
								jQuery.sap.log.error("Error -" + err.message);
							}
							//if counter is lesser than total records selected, do recursive call fnAction function
							if (counter < TotalRecords) {
								setTimeout(function() {
									fnAction();
								}, 70);
							} else { //Refresh the table to clear all the rows processed
								setTimeout(function() {
									fnRefreshTable(ProcessedIndices, gAction);
								}, 150);
							}
						},
						function(oError) {
							jQuery.sap.log.error("Error -" + strUrl);
							result = "Error";
							counter++;
							try {
								progess = Math.round(((counter / TotalRecords) * 100));
								sap.ui.getCore().byId(gAction).setDisplayValue(progess + "%");
								sap.ui.getCore().byId(gAction).setPercentValue(progess);
							} catch (err) {
								jQuery.sap.log.error("Error -" + err.message);
							}
							if (counter < TotalRecords) {
								setTimeout(function() {
									fnAction();
								}, 70);
							} else {
								setTimeout(function() {
									fnRefreshTable(ProcessedIndices, gAction);
								}, 150);
							}
						});
				};

			}

			function JSONToCSVConvertor(JSONData, SelRecs, ReportTitle, ShowLabel, dialog) {
				//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
				// var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
				var arrData = JSONData;
				var CSV = '';
				//This condition will generate the Label/Header
				if (ShowLabel) {
					var row = "";
					row =
						"User ID,User Name,User Country,Assignment Type,Position,Parent Name,Parent Country,Parent Functional Area,Valid From,Valid To,Role Added Date,Request Expiry Date,Last Review Date,Last Attester ID,Last Attester Name,Last Action,Last Review Comments,Last Position Change,Manager,Personnel Area Code,Org. Unit,Job Function,Business Node 1,Business Node 2,Vendor Name";
					//append Label row with line break
					CSV += row + '\r\n';
				}
				//1st loop is to extract each row
				for (var i = 0; i < arrData.length; i++) {
					var row = "";
					//2nd loop will extract each column and convert it in string comma-seprated+
					if (SelRecs.length > 0) {
						for (var e = 0; e < SelRecs.length; e++) {
							if (SelRecs[e].indexOf(arrData[i]["LinkID"]) > -1) {
								for (var index in arrData[i]) {
									if (index.indexOf("LinkID") == -1) {
										row += '"' + arrData[i][index] + '",';
									}
								}
							}
						}
					} else {
						for (var index in arrData[i]) {
							if (index.indexOf("LinkID") == -1) {
								row += '"' + arrData[i][index] + '",';
							}
						}
					}
					if (row.length > 0) {
						row.slice(0, row.length - 1);
						//add a line break after each row
						CSV += row + '\r\n';
					}
				}
				if (CSV == '') {
					jQuery.sap.log.error("Invalid data in CSV file");
					return;
				}
				//this trick will generate a temp "a" tag
				var link = document.createElement("a");
				link.id = "lnkDwnldLnk";
				//this part will append the anchor tag and remove it after automatic click
				document.body.appendChild(link);
				var csv = CSV;
				var filename = ReportTitle;
				var blob = new Blob([csv], {
					type: 'text/csv;charset=utf-8'
				});
				if (navigator.appVersion.toString().indexOf('.NET') > 0) {
					window.navigator.msSaveBlob(blob, filename);
				} else {
					var csvUrl = window.URL.createObjectURL(blob);
					$("#lnkDwnldLnk")
						.attr({
							'download': filename,
							'href': csvUrl
						});
					$('#lnkDwnldLnk')[0].click();
					document.body.removeChild(link);
				}
				dialog.close();
			}

			function fnRefreshTable(ProcessedRow, ActionType) {
				var oThisObj = new Object();
				var index = "";
				var m = oTable.getModel();
				var oRows = m.getProperty("/data");
				for (var p = ProcessedRow.length - 1; p >= 0; p--) {
					oThisObj = ProcessedRow[p];
					index = $.map(oRows, function(obj, index) {
						if (obj === oThisObj) {
							return index;
						}
					});
					oRows.splice(index, 1);
				}
				m.setProperty("/data", oRows);
				oTable.clearSelection();
				selectedRowPage = "";
				selectedRowIndex = "";
				fnPaintRows();
				setTimeout(function() {
					if (ActionType == "CERTIFY") {
						sap.ui.getCore().byId("ApproveDialog").close();
					} else if (ActionType == "REJECT") {
						sap.ui.getCore().byId("RejectDialog").close();
					} else if (ActionType == "DELEGATE") {
						sap.ui.getCore().byId("DelegateDialog").close();
					};
					sText = "";
					comment = "";
					gAction = "";
					gDelegate = "";
				}, 500);
				document.getElementById("details").style.visibility = "hidden";
				document.getElementById("userdetails").style.visibility = "hidden";
			}

			function fnLoadMainTable() {
				var aData;
				$.ajax({
					type: 'GET',
					url: "/IDM/IdmTaskCollection",
					async: true,
					success: function(aData) {
						var fArr = [];
						fArr = aData;
						var oMModel = new sap.ui.model.json.JSONModel();
						oMModel.setSizeLimit(9999);
						oMModel.setData({
							data: fArr
						});
						oTable.setModel(oMModel);
						oTable.bindRows("/data");
						oTable.setBusy(false);
						oTable._oPaginator.attachPage(function() {
							fnPaintRows();
						});
						//Retrieve UserName from Cookie
						var name = "IDMUserName=";
						var ca = document.cookie.split(';');
						for (var i = 0; i < ca.length; i++) {
							var c = ca[i];
							while (c.charAt(0) == ' ') {
								c = c.substring(1);
							}
							if (c.indexOf(name) == 0) {
								sap.ui.getCore().byId("LoggedUser").setText(c.substring(name.length, c.length));
							}
						}
						$("#splash-screen").remove();
					},
					error: function(data, status, er) {
						jQuery.sap.log.error("status: " + status + " Reason:" + er);
						oTable.setBusy(false);
						$("#splash-screen").remove();
					}
				});
			}

			function fnPaintRows() {
				var rows = oTable.getVisibleRowCount(); //number of rows on tab
				for (var i = 0; i < rows; i++) {
					$("#__view0-col0-row" + i).toggleClass("selectedRow", false);
					$("#__view1-col1-row" + i).toggleClass("selectedRow", false);
					$("#__view2-col2-row" + i).toggleClass("selectedRow", false);
					$("#__view3-col3-row" + i).toggleClass("selectedRow", false);
					$("#__view4-col4-row" + i).toggleClass("selectedRow", false);
					$("#__view5-col5-row" + i).toggleClass("selectedRow", false);
					$("#__view6-col6-row" + i).toggleClass("selectedRow", false);
				}
				if (selectedRowIndex >= 0 && oTable._oPaginator.getCurrentPage() == selectedRowPage) {
					$("#__view0-col0-row" + selectedRowIndex).toggleClass("selectedRow", true);
					$("#__view1-col1-row" + selectedRowIndex).toggleClass("selectedRow", true);
					$("#__view2-col2-row" + selectedRowIndex).toggleClass("selectedRow", true);
					$("#__view3-col3-row" + selectedRowIndex).toggleClass("selectedRow", true);
					$("#__view4-col4-row" + selectedRowIndex).toggleClass("selectedRow", true);
					$("#__view5-col5-row" + selectedRowIndex).toggleClass("selectedRow", true);
					$("#__view6-col6-row" + selectedRowIndex).toggleClass("selectedRow", true);
				}
			}

			function fnUserDetails() {
				var oLayout = new sap.ui.commons.layout.MatrixLayout({
					id: "matrix1",
					layoutFixed: false
				});
				oLayout.createRow(new sap.ui.commons.Label({
						text: "User Name"
					}),
					new sap.ui.commons.TextField("lblUserName", {
						value: "",
						width: "190px",
						enabled: true,
						editable: false
					}),
					new sap.ui.commons.Label({
						text: "Manager"
					}),
					new sap.ui.commons.TextField("lblManager", {
						value: "",
						width: "180px",
						enabled: true,
						editable: false
					}),
					new sap.ui.commons.Label({
						text: "PA Code",
						tooltip: "Personnel Area Code (Country)"
					}),
					new sap.ui.commons.TextField("lblPerCode", {
						value: "",
						width: "100px",
						enabled: true,
						editable: false
					}),
					new sap.ui.commons.Label({
						text: "Job Function"
					}),
					new sap.ui.commons.TextField("lblJobFunc", {
						value: "",
						width: "145px",
						enabled: true,
						editable: false
					}),
					new sap.ui.commons.Label({
						text: "Business Node1"
					}),
					new sap.ui.commons.TextField("lblNode1", {
						value: "",
						width: "210px",
						enabled: true,
						editable: false
					})
				);
				oLayout.createRow(new sap.ui.commons.Label({
						text: "User Id"
					}),
					new sap.ui.commons.TextField("lblSystemId", {
						value: "",
						width: "190px",
						enabled: true,
						editable: false
					}),
					new sap.ui.commons.Label({
						text: "Last position Change"
					}),
					new sap.ui.commons.TextField("lblLastPos", {
						value: "",
						width: "180px",
						enabled: true,
						editable: false
					}),
					new sap.ui.commons.Label({
						text: "Org Unit"
					}),
					new sap.ui.commons.TextField("lblOrgUnit", {
						value: "",
						width: "100px",
						enabled: true,
						editable: false
					}),
					new sap.ui.commons.Label({
						text: "Vendor Name"
					}),
					new sap.ui.commons.TextField("lblVName", {
						value: "",
						width: "145px",
						enabled: true,
						editable: false
					}),
					new sap.ui.commons.Label({
						text: "Business Node2"
					}),
					new sap.ui.commons.TextField("lblNode2", {
						value: "",
						width: "210px",
						enabled: true,
						editable: false
					})
				);
				oLayout.createRow(new sap.ui.commons.Label({
					text: ""
				}));
				oLayout.placeAt("userdetails");
			}

			function fnCreateRightTree() {
				//*********************************************************************************************************
				// RIGHT TREE 
				var oReviewTable = new sap.ui.table.Table("oReviewTable", {
					selectionMode: sap.ui.table.SelectionMode.None,
					visibleRowCount: 6
				});
				var oColumn1 = new sap.ui.table.Column({
					width: "114px",
					label: "Review Date",
					template: new sap.ui.commons.TextView({
						text: "{AD}"
					}),
					sortProperty: "AD"
				});
				oReviewTable.addColumn(oColumn1);
				var oColumn2 = new sap.ui.table.Column({
					label: "Responsible",
					width: "110px",
					template: new sap.ui.commons.TextView({
						text: "{RID}",
						width: "100%",
						wrapping: true
					})
				});
				oReviewTable.addColumn(oColumn2);
				var oColumn3 = new sap.ui.table.Column({
					width: "74px",
					label: "Action",
					template: new sap.ui.commons.TextView({
						text: "{OP}"
					})
				});
				oReviewTable.addColumn(oColumn3);
				var oColumn4 = new sap.ui.table.Column({
					width: "100%",
					label: "Comments",
					template: new sap.ui.commons.TextArea({
						width: "100%",
						editable: false,
						value: "{RE}",
						tooltip: "{RE}",
						rows: 2,
						wrapping: sap.ui.core.Wrapping.Hard
					})
				});
				oReviewTable.addColumn(oColumn4);
				oReviewTable.setShowNoData(false);
				var vLayout = new sap.ui.layout.VerticalLayout({
					content: [oReviewTable]
				});
				return vLayout;

				// END OF RIGHT TREE
				//********************************************************************************************************** 
			};

			function fnCreateLeftTree() {
				//*********************************************************************************************************
				// LEFT TREE
				var oLtreeTable = new sap.ui.table.TreeTable("oLtreeTable", {
					columns: [
						new sap.ui.table.Column({
							label: new sap.ui.commons.Label({
								text: "How access is assgined?",
								textAlign: sap.ui.core.TextAlign.Center
							}),
							template: new sap.ui.commons.TextView({
								text: "{name}"
							})
						})
					],
					selectionMode: sap.ui.table.SelectionMode.None,
					enableColumnReordering: false,
					visibleRowCount: 7,
					expandFirstLevel: true
				});
				oLtreeTable.setShowNoData(false);

				var vLayout = new sap.ui.layout.VerticalLayout({
					content: [oLtreeTable]
				});
				return vLayout;
				// END OF LEFT TREE
				//********************************************************************************************************** 
			};

			function fnCreateMiddleTable() {
				var oLabel = new sap.ui.commons.Label({
					textAlign: sap.ui.core.TextAlign.Center,
					text: "All access assigments",
					width: "100%"
				});
				var oText = new sap.ui.commons.TextView("CtrltextView", {
					text: "{name}",
					visible: "{tlink}"
				});
				var oLink = new sap.ui.commons.Link("CtrlLink", {
					text: "{name}",
					visible: "{hlink}",
					target: "{REF_ID}",
					press: function(oEvent) {
						fnShowPopover(oEvent);
					}
				});
				var oBlank = new sap.ui.commons.Label({
					text: "  ",
					width: "10px"
				});
				var oTextStatus = new sap.ui.commons.TextView("CtrlStatus", {
					text: "{status}"
				});
				var oTLayout = new sap.ui.layout.HorizontalLayout({
					content: [oText, oLink, oBlank, oTextStatus]
				});
				//Create an instance of the table control
				var oRtreeTable = new sap.ui.table.TreeTable("oRtreeTable", {
					columns: [
						new sap.ui.table.Column({
							label: new sap.ui.commons.Label({
								text: "All access assigments",
								textAlign: sap.ui.core.TextAlign.Center
							}),
							template: oTLayout
						})
					],
					selectionMode: sap.ui.table.SelectionMode.None,
					visibleRowCount: 7,
					enableColumnReordering: false,
					expandFirstLevel: true
				});
				oRtreeTable.setShowNoData(false);
				return oRtreeTable;
			}

			function fnLoadDetails(id, linkid, UserName, TaskTitle, PosAddDate) {
				var objReviewTable = sap.ui.getCore().byId("oReviewTable");
				var oModelReview = new sap.ui.model.odata.ODataModel("/idmrestapi/v2/service/", true);
				oModelReview.read("/TaskHistory?", null, "Scope=Assignment&LinkId=" + linkid + "&TaskType=Attestation&$format=json", true,
					function(oRData, oResponse) {
						var oModelReview = new sap.ui.model.json.JSONModel();
						var oStr = "";
						var oReason = "";
						var oDate = "";
						var oMonth = "";
						var op = "";
						var x = "";
						var oYear = "";
						for (var r = 0; r < oRData.results.length; r++) {
							oReason = "";
							oDate = "";
							oMonth = "";
							op = "";
							oYear = "";
							x = "";
							if (oRData.results[r].REASON != null) oReason = oRData.results[r].REASON;
							x = oRData.results[r].AUDIT_DATE.toString();
							if (x != null && x.length != 0) {
								x = x.split(" ");
								if (x.length > 0) {
									oMonth = x[1];
									oDate = x[2];
									oYear = x[3];
								}
								switch (oMonth.toLowerCase()) {
									case "jan":
										oMonth = "01";
										break;
									case "feb":
										oMonth = "02";
										break;
									case "mar":
										oMonth = "03";
										break;
									case "apr":
										oMonth = "04";
										break;
									case "may":
										oMonth = "05";
										break;
									case "jun":
										oMonth = "06";
										break;
									case "jul":
										oMonth = "07";
										break;
									case "aug":
										oMonth = "08";
										break;
									case "sep":
										oMonth = "09";
										break;
									case "oct":
										oMonth = "10";
										break;
									case "nov":
										oMonth = "11";
										break;
									case "dec":
										oMonth = "12";
										break;
								}
							}
							if (oRData.results[r].OPERATION != null && oRData.results[r].OPERATION.length > 0) {
								if (oRData.results[r].OPERATION.split(" ")[1]) op = oRData.results[r].OPERATION.split(" ")[1];
							}
							if (r == 0) {
								oStr = '{"AD":"' + oYear + '-' + oMonth + '-' + oDate + '","RID":"' + oRData.results[r].RESPONSIBLE_DISPLAYNAME + '","RE":"' +
									oReason + '","OP":"' + op + '"}';
							} else {
								oStr = oStr + ',' + '{"AD":"' + oYear + '-' + oMonth + '-' + oDate + '","RID":"' + oRData.results[r].RESPONSIBLE_DISPLAYNAME +
									'","RE":"' + oReason + '","OP":"' + op + '"}';
							}
						}
						oStr = $.parseJSON('[' + oStr + ']');
						var aData = {
							root: oStr
						};
						oModelReview.setSizeLimit(9000);
						oModelReview.setData(aData);
						objReviewTable.setModel(oModelReview);
						objReviewTable.bindRows("/root");
						objReviewTable.sort(objReviewTable.getColumns()[0], sap.ui.table.SortOrder.Descending);
					},
					function(oError) {
						jQuery.sap.log.error(oError);
						oModelReview.destroy();
					}
				);
				sap.ui.getCore().byId("lblSystemId").setValue("");
				sap.ui.getCore().byId("lblUserName").setValue("");
				sap.ui.getCore().byId("lblManager").setValue("");
				sap.ui.getCore().byId("lblManager").setTooltip("");
				sap.ui.getCore().byId("lblLastPos").setValue("");
				sap.ui.getCore().byId("lblPerCode").setValue("");
				sap.ui.getCore().byId("lblOrgUnit").setValue("");
				sap.ui.getCore().byId("lblJobFunc").setValue("");
				sap.ui.getCore().byId("lblNode1").setValue("");
				sap.ui.getCore().byId("lblNode2").setValue("");
				sap.ui.getCore().byId("lblVName").setValue("");
				var oModelUser = new sap.ui.model.odata.ODataModel("/idmrestapi/v2/service/", true);
/*	CHG1206648 raised to change TASK_GUID value for ET_MX_PERSON from "F539212A-54D0-41EF-AC9E-5042D8861F13" to "0FE6F66F-FDEF-4E2E-9ABE-FDD4DC5E8943"*/				
				oModelUser.read("ET_MX_PERSON(ID=" + id + ",TASK_GUID= guid'0FE6F66F-FDEF-4E2E-9ABE-FDD4DC5E8943')?", null,
					"$expand=ER_MX_MANAGER&$format=json", true,
					function(UserDetails, oResponse) {
						sap.ui.getCore().byId("lblSystemId").setValue(UserDetails.SV_MSKEYVALUE);
						sap.ui.getCore().byId("lblSystemId").setTooltip(UserDetails.SV_MSKEYVALUE);
						sap.ui.getCore().byId("lblUserName").setValue(UserDetails.SV_DISPLAYNAME);
						sap.ui.getCore().byId("lblUserName").setTooltip(UserDetails.SV_DISPLAYNAME);
						var Manager = UserDetails.ER_MX_MANAGER.results;
						for (var m = 0; m < Manager.length; m++) {
							sap.ui.getCore().byId("lblManager").setValue(Manager[0].REFERENCED_DISPLAY_NAME);
							sap.ui.getCore().byId("lblManager").setTooltip(Manager[0].REFERENCED_DISPLAY_NAME);
							break;
						}
						sap.ui.getCore().byId("lblLastPos").setValue(PosAddDate);
						sap.ui.getCore().byId("lblLastPos").setTooltip(PosAddDate);
						sap.ui.getCore().byId("lblPerCode").setValue(UserDetails.SV_MX_FS_PERSONNEL_AREA_ID + " (" + UserDetails.SV_Z_COUNTRY + ")");
						sap.ui.getCore().byId("lblPerCode").setTooltip(UserDetails.SV_MX_FS_PERSONNEL_AREA_ID + " (" + UserDetails.SV_Z_COUNTRY + ")");
						sap.ui.getCore().byId("lblOrgUnit").setValue(UserDetails.SV_MX_FS_ORGANIZATIONAL_UNIT);
						sap.ui.getCore().byId("lblOrgUnit").setTooltip(UserDetails.SV_MX_FS_ORGANIZATIONAL_UNIT);
						sap.ui.getCore().byId("lblJobFunc").setValue(UserDetails.SV_MX_JOB_FUNCTION);
						sap.ui.getCore().byId("lblJobFunc").setTooltip(UserDetails.SV_MX_JOB_FUNCTION);
						sap.ui.getCore().byId("lblNode1").setValue(UserDetails.SV_Z_BUSINESS_NODE_1);
						sap.ui.getCore().byId("lblNode1").setTooltip(UserDetails.SV_Z_BUSINESS_NODE_1);
						sap.ui.getCore().byId("lblNode2").setValue(UserDetails.SV_Z_BUSINESS_NODE_2);
						sap.ui.getCore().byId("lblNode2").setTooltip(UserDetails.SV_Z_BUSINESS_NODE_2);
						sap.ui.getCore().byId("lblVName").setValue(UserDetails.SV_Z_VENDOR_NAME);
						sap.ui.getCore().byId("lblVName").setTooltip(UserDetails.SV_Z_VENDOR_NAME);
						oModelUser.destroy();
					},
					function(oError) {
						jQuery.sap.log.error(oError);
						oModelUser.destroy();
					}
				);
				var PosArr = [];
				var SsArr = [];
				var SsChildArr = [];
				var ParentArr = [];
				var SsChildMatchArr = [];
				var ParentMatchArr = [];
				var oRTreeData = "";
				var oLTreeData = "";
				var oRtreeTable = sap.ui.getCore().byId("oRtreeTable");
				var oLtreeTable = sap.ui.getCore().byId("oLtreeTable");
				var oModelTree = new sap.ui.model.json.JSONModel();
				var array1 = $.parseJSON('{"name": "root","checked": false}');
				var da = {
					root: array1
				};
				oModelTree.setSizeLimit(9000);
				oModelTree.setData(da);
				oRtreeTable.setModel(oModelTree);
				oRtreeTable.bindRows("/root");

				var oLModelTree = new sap.ui.model.json.JSONModel();
				var array2 = $.parseJSON('{"name": "root","checked": false}');
				var da2 = {
					root: array2
				};
				oLModelTree.setSizeLimit(9000);
				oLModelTree.setData(da2);
				oLtreeTable.setModel(oLModelTree);
				oLtreeTable.bindRows("/root");
				var oModelAssignmnt = new sap.ui.model.odata.ODataModel("/idmrestapi/v2/service/", true);
				/*	CHG1206648 raised to change TASK_GUID value for ET_MX_PERSON from "F539212A-54D0-41EF-AC9E-5042D8861F13" to "0FE6F66F-FDEF-4E2E-9ABE-FDD4DC5E8943"*/
				oModelAssignmnt.read("/ET_MX_PERSON(ID=" + id + ",TASK_GUID= guid'0FE6F66F-FDEF-4E2E-9ABE-FDD4DC5E8943')?", null,
					"$expand=ER_MX_AUTOROLE&showIndirect&$format=json", true,
					function(oAData, oResponse) {
						oRTreeData = '{"name": "root","checked": false,"0": {"name": "' + oAData.SV_MSKEYVALUE +
							'","tlink": true,"hlink" : false,"checked": true';
						oLTreeData = '{"name": "root","checked": false,"0": {"name": "' + oAData.SV_MSKEYVALUE +
							'","tlink": true,"hlink" : false,"checked": false';
						var Assgnmnt = oAData.ER_MX_AUTOROLE.results;
						for (var k = 0; k < Assgnmnt.length; k++) {
							if (Assgnmnt[k].REFERENCED_DISPLAY_NAME.toUpperCase().indexOf("POSITION") == 0 && Assgnmnt[k].DIRECTLY_ASSIGNED == true) {
								PosArr.push(Assgnmnt[k].REFERENCED_DISPLAY_NAME + "~" + Assgnmnt[k].STATE_TEXT);
							} else if (Assgnmnt[k].REFERENCED_DISPLAY_NAME.toUpperCase().indexOf("SS:") > -1 && Assgnmnt[k].DIRECTLY_ASSIGNED == false) {
								SsArr.push(Assgnmnt[k].REFERENCED_DISPLAY_NAME + "~" + Assgnmnt[k].STATE_TEXT);
							} else if (Assgnmnt[k].DIRECTLY_ASSIGNED == true) {
								if (Assgnmnt[k].INHERITED == true) {
									SsChildArr.push(Assgnmnt[k].REFERENCED_DISPLAY_NAME + "~" + Assgnmnt[k].REFERENCED_ID + "~     " + Assgnmnt[k].STATE_TEXT);
									if (TaskTitle.toUpperCase() == Assgnmnt[k].REFERENCED_DISPLAY_NAME.toUpperCase()) {
										SsChildMatchArr.push(Assgnmnt[k].REFERENCED_DISPLAY_NAME + "~" + Assgnmnt[k].REFERENCED_ID);
									}
								}
								ParentArr.push(Assgnmnt[k].REFERENCED_DISPLAY_NAME + "~" + Assgnmnt[k].REFERENCED_ID + "~     " + Assgnmnt[k].STATE_TEXT);
								if (TaskTitle.toUpperCase() == Assgnmnt[k].REFERENCED_DISPLAY_NAME.toUpperCase()) {
									ParentMatchArr.push(Assgnmnt[k].REFERENCED_DISPLAY_NAME + "~" + Assgnmnt[k].REFERENCED_ID);
								}
							} else if (Assgnmnt[k].DIRECTLY_ASSIGNED == false) {
								SsChildArr.push(Assgnmnt[k].REFERENCED_DISPLAY_NAME + "~" + Assgnmnt[k].REFERENCED_ID + "~     " + Assgnmnt[k].STATE_TEXT);
								if (TaskTitle.toUpperCase() == Assgnmnt[k].REFERENCED_DISPLAY_NAME.toUpperCase()) {
									SsChildMatchArr.push(Assgnmnt[k].REFERENCED_DISPLAY_NAME + "~" + Assgnmnt[k].REFERENCED_ID);
								}
							}
						}
						//Sort all array
						SsChildArr.sort();
						ParentArr.sort();
						ParentMatchArr.sort();
						SsChildMatchArr.sort();
						//Attach POS
						var oPOSNode = "";
						var oLPOSNode = "";
						if (PosArr.length > 0) {
							oPOSNode = ',"0":{' + '"name":"' + PosArr[0].split("~")[0] + '","status":"' + PosArr[0].split("~")[1] +
								'","tlink": true,"hlink" : false,"checked": true';
							if (SsChildMatchArr.length > 0) oLPOSNode = ',"0":{' + '"name":"' + PosArr[0].split("~")[0] + '","checked": true';
						}
						oRTreeData = oRTreeData + oPOSNode;
						oLTreeData = oLTreeData + oLPOSNode;
						//Attach SS NodeW
						var oSSNode = "";
						var oLSSNode = "";
						var oSSChildNode = "";
						var oSSMatchChildNode = "";
						var oPrivNode = "";
						var oModelPriv = new sap.ui.model.odata.ODataModel("/idmrestapi/v2/service/", true);
						if (SsArr.length > 0) {
							oSSNode = ',"0":{' + '"name":"' + SsArr[0].split("~")[0] + '","status":"' + SsArr[0].split("~")[1] +
								'","tlink": true,"hlink" : false,"checked": true';
							//Attach SS childNodes
							for (var c = 0; c < SsChildArr.length; c++) {
								oSSChildNode += ',"' + c + '":{';
								oSSChildNode += '"name":"' + SsChildArr[c].split("~")[0] + '","status":"' + SsChildArr[c].split("~")[2] +
									'","tlink": false,"REF_ID":' + SsChildArr[c].split("~")[1] + ',"hlink" : true,"checked": true}';
							}
							//Attach matching Parent Name under SS
							if (SsChildMatchArr.length > 0) {
								oLSSNode = ',"0":{' + '"name":"' + SsArr[0].split("~")[0] + '","checked": false';
								oSSMatchChildNode = ',"0":{';
								oSSMatchChildNode += '"name":"' + SsChildMatchArr[0].split("~")[0] + '","checked": false';
/*	CHG1206648 raised to change TASK_GUID value for ET_MX_ROLE from "A02B092A-75BC-4018-95EF-67616DB6B9B6" to "679BD7C5-1332-4349-8DE1-6E34C8F13814"*/								
								oModelPriv.read("ET_MX_ROLE(ID=" + SsChildMatchArr[0].split("~")[1] +
									",TASK_GUID= guid'679BD7C5-1332-4349-8DE1-6E34C8F13814')", null,
									"$expand=ER_MXMEMBER_MX_PRIVILEGE&showIndirect&$format=json", false,
									function(oPrivData, oResponse) {
										var r = oPrivData;
										for (var p = 0; p < r.ER_MXMEMBER_MX_PRIVILEGE.results.length; p++) {
											oPrivNode += ',"' + p + '":{';
											oPrivNode += '"name":"' + r.ER_MXMEMBER_MX_PRIVILEGE.results[p].REFERENCED_DISPLAY_NAME + '","checked": false}';
										}
									},
									function(oError) {
										jQuery.sap.log.error(oError);
										oModelPriv.destroy();
									});
								oSSMatchChildNode += oPrivNode;
								oSSMatchChildNode += "}";
							}
						}
						oRTreeData = oRTreeData + oSSNode;
						oLTreeData = oLTreeData + oLSSNode;
						oRTreeData += oSSChildNode;
						oLTreeData += oSSMatchChildNode;
						if (SsArr.length > 0) {
							oRTreeData += '}';
							if (SsChildMatchArr.length > 0) oLTreeData += '}';
						}
						//Attach Parent Direct Node to root
						var oParentDirect = "";
						var counter = 0;
						if (PosArr.length > 0) {
							oRTreeData += '}';
							if (SsChildMatchArr.length > 0) oLTreeData += '}';
							counter = 1;
						}
						for (var d = 0; d < ParentArr.length; d++) {
							oParentDirect += ',"' + counter + '":{';
							oParentDirect += '"name":"' + ParentArr[d].split("~")[0] + '","status":"' + ParentArr[d].split("~")[2] +
								'","tlink": false,"REF_ID":' + ParentArr[d].split("~")[1] + ',"hlink" : true,"checked": true}';
							counter += 1;
						}
						//Attach parent direct Node for Matching Parent Node
						var oParentMatch = "";
						oPrivNode = "";
						if (ParentMatchArr.length > 0) {
							if (SsChildMatchArr.length > 0) {
								oParentMatch += ',"1":{';
							} else {
								oParentMatch += ',"0":{';
							}
							oParentMatch += '"name":"' + ParentMatchArr[0].split("~")[0] + '","checked": false';
/*	CHG1206648 raised to change TASK_GUID value for ET_MX_ROLE from "A02B092A-75BC-4018-95EF-67616DB6B9B6" to "679BD7C5-1332-4349-8DE1-6E34C8F13814"*/							
							oModelPriv.read("ET_MX_ROLE(ID=" + ParentMatchArr[0].split("~")[1] + ",TASK_GUID= guid'679BD7C5-1332-4349-8DE1-6E34C8F13814')",
								null, "$expand=ER_MXMEMBER_MX_PRIVILEGE&showIndirect&$format=json", false,
								function(oPrivData, oResponse) {
									var r = oPrivData;
									for (var p = 0; p < r.ER_MXMEMBER_MX_PRIVILEGE.results.length; p++) {
										oPrivNode += ',"' + p + '":{';
										oPrivNode += '"name":"' + r.ER_MXMEMBER_MX_PRIVILEGE.results[p].REFERENCED_DISPLAY_NAME + '","checked": false}';
									}
								},
								function(oError) {
									jQuery.sap.log.error(oError);
									oModelPriv.destroy();
								});
							oParentMatch += oPrivNode;
							oParentMatch += '}';
						}

						oRTreeData += oParentDirect;
						oRTreeData += '}}';
						oLTreeData += oParentMatch;
						oLTreeData += '}}';
						array1 = $.parseJSON(oRTreeData);
						da = {
							root: array1
						};
						oModelTree.setData(da);
						oRtreeTable.setModel(oModelTree);
						oRtreeTable.bindRows("/root");
						try {
							array2 = $.parseJSON(oLTreeData);
						} catch (er) {
							jQuery.sap.log.error(er.message);
						}
						da2 = {
							root: array2
						};
						oLModelTree.setData(da2);
						oLtreeTable.setModel(oLModelTree);
						oLtreeTable.bindRows("/root");
						sap.ui.getCore().byId("oRtreeTable").setBusy(false);
						sap.ui.getCore().byId("oLtreeTable").setBusy(false);
						sap.ui.getCore().byId("oReviewTable").setBusy(false);
						oModelAssignmnt.destroy();
					},
					function(oError) {
						jQuery.sap.log.error(oError);
						oModelAssignmnt.destroy();
					}
				);
			}
			
			function occurrences(string, subString, allowOverlapping) {

			    string += "";
			    subString += "";
			    if (subString.length <= 0) return (string.length + 1);

			    var n = 0,
			        pos = 0,
			        step = allowOverlapping ? 1 : subString.length;

			    while (true) {
			        pos = string.indexOf(subString, pos);
			        if (pos >= 0) {
			            ++n;
			            pos += step;
			        } else break;
			    }
			    return n;
			}
			function fnShowPopover(oEvent) {
				var CtrlID = oEvent.getParameter("id");
				var UserID = sap.ui.getCore().byId(CtrlID).getTarget();
				var popover = new sap.m.Popover({
					title: "Loading",
					ShowHeader: false,
					placement: sap.m.PlacementType.Auto,
					afterClose: function(oControlEvent) {
						sap.ui.getCore().byId(oControlEvent.getParameter("id")).destroy();
					}
				});
				popover.openBy(sap.ui.getCore().byId(CtrlID));
				popover.setBusy(true);
				var oModelPriv = new sap.ui.model.odata.ODataModel("/idmrestapi/v2/service/", true);
/*	CHG1206648 raised to change TASK_GUID value for ET_MX_ROLE from "A02B092A-75BC-4018-95EF-67616DB6B9B6" to "679BD7C5-1332-4349-8DE1-6E34C8F13814"*/
				oModelPriv.read("ET_MX_ROLE(ID=" + UserID + ",TASK_GUID= guid'679BD7C5-1332-4349-8DE1-6E34C8F13814')", null,
					"$expand=ER_MXMEMBER_MX_PRIVILEGE&showIndirect&$format=json", true,
					function(oPrivData, oResponse) {
						var r = oPrivData;
						var VCtrl = new sap.ui.layout.VerticalLayout();
						for (var p = 0; p < r.ER_MXMEMBER_MX_PRIVILEGE.results.length; p++) {
							VCtrl.addContent(new sap.m.Label({
								text: r.ER_MXMEMBER_MX_PRIVILEGE.results[p].REFERENCED_DISPLAY_NAME + "     " + r.ER_MXMEMBER_MX_PRIVILEGE.results[p].STATE_TEXT
							}));
						}
						popover.setTitle(r.SV_MSKEYVALUE);
						popover.addContent(VCtrl);
						popover.setBusy(false);
						oModelPriv.destroy();
					},
					function(oError) {
						jQuery.sap.log.error(oError);
						oModelPriv.destroy();
					});
			}
		}
	});
});