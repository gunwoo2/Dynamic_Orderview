/*global QUnit*/

sap.ui.define([
	"syncea/orderview/controller/Order.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Order Controller");

	QUnit.test("I should test the Order controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
