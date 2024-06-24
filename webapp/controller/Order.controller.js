sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, MessageToast, DateFormat) {
        "use strict";

        return Controller.extend("sync.ea.orderview.controller.Order", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("order").attachPatternMatched(this._onRouteMatched, this);
            },
      
            _onRouteMatched: function (oEvent) {
                var sTelno = oEvent.getParameter("arguments").sTelno;
                this._loadTelnoData(sTelno);
            },
      
            _loadTelnoData: function (sTelno) {
                if (!sTelno) {
                    MessageToast.show("휴대폰 번호가 제공되지 않았습니다.");
                    return;
                }
      
                this.onFilter(sTelno);
            },
      
            onFilter: function (sTelno) {
                var aFilters = [];
                var oList = this.byId("list");
                var oTable = this.byId("responsiveTable");
      
                // 휴대폰 번호 필터 추가
                if (sTelno) {
                    aFilters.push(new Filter("Telno", FilterOperator.EQ, sTelno));
                }
      
                // 필터 적용
                if (oList.getBinding("items")) {
                    oList.getBinding("items").filter(aFilters);
                    console.log("Filters applied to list:", aFilters);
                } else {
                    console.error("List binding not found");
                }
      
                if (oTable.getBinding("items")) {
                    oTable.getBinding("items").filter(aFilters);
                    console.log("Filters applied to table:", aFilters);
      
                    // 테이블 데이터가 로드된 후에 총 재고량을 계산
                    oTable.getBinding("items").attachDataReceived(this._calculateTotalQty.bind(this));
                } else {
                    console.error("Table binding not found");
                }
            },
    
      
            _getDateDifference: function (sDate1) {
                var oDateFormat = DateFormat.getDateInstance({ pattern: "yyyyMMdd" });
                var oDate1 = oDateFormat.parse(sDate1);
                var oDate2 = new Date();
          
                var iDifferenceInTime = oDate2.getTime() - oDate1.getTime();
                var iDifferenceInDays = iDifferenceInTime / (1000 * 3600 * 24);
                return Math.floor(iDifferenceInDays);
              },
          
              _getStatusState: function (sTsdat) {
                var iDaysDifference = this._getDateDifference(sTsdat);
                if (iDaysDifference <= 3) {
                  return "Error";
                } else if (iDaysDifference > 3) {
                  return "Success";
                } else if (iDaysDifference < 0) {
                  return "Warning";
                }
              }
        });
      });