js.base.Controller.extend( "js.controller.inbound", {

	onInit: function() {
		this.getView().setModel( new sap.ui.model.json.JSONModel(), "message" );

		console.debug( "init js.controller.inbound" );
	},

	onDeviceSelectChange: function( oEvent ) {
		var that = this;

		var oSelectedItem = oEvent.getParameter( "selectedItem" );
		var sKey = oSelectedItem.getKey();
		if ( "placeholder" === sKey ) {

			console.log( "device placeholder selected" );

			that.getView().getModel( "message" ).setData( [] );
			that.getView().oSegmentedButton.setEnabled( false );
			that.getView().oSwitch.setEnabled( false );
			that.getView().oInput.setEnabled( false );
			that.getView().oButton.setEnabled( false );

			that.getView().oInput.setValue( "" );
			that.getView().oSwitch.setState( false );
			that.getView().oSegmentedButton.setSelectedKey( "http" );

			return;
		}

		var successHandler = function( oData, textStatus, jqXHR ) {
			oData.unshift( {
				id: "placeholder",
				name: that.getText( "TEXT_SELECT" )
			} );

			that.getView().getModel( "message" ).setData( oData );
		};

		var sDeviceType = oSelectedItem.getCustomData()[0].getValue();

		console.warn( "change url to  " + "data/messagetypes/".concat( sDeviceType ) );
		// var sUrl = "data/messagetypes/".concat( sDeviceType );
		var sUrl = "message.json";

		this.doGet( sUrl, successHandler );
	},

	onMessageSelectChange: function( oEvent ) {
		var that = this;

		var oSelectedItem = oEvent.getParameter( "selectedItem" );
		var sKey = oSelectedItem.getKey();

		if ( "placeholder" === sKey ) {

			console.log( "message placeholder selected" );

			that.getView().oSegmentedButton.setEnabled( false );
			that.getView().oSwitch.setEnabled( false );
			that.getView().oInput.setEnabled( false );
			that.getView().oButton.setEnabled( false );

			that.getView().oInput.setValue( "" );
			that.getView().oSwitch.setState( false );
			that.getView().oSegmentedButton.setSelectedKey( "http" );

			return;
		}

		that.getView().oSegmentedButton.setEnabled( true );
		that.getView().oSwitch.setEnabled( true );
		that.getView().oInput.setEnabled( true );
		that.getView().oButton.setEnabled( true );

	},

	onSwitchChange: function( oEvent ) {
		var bState = oEvent.getParameter( "state" );
		var sOperand = bState == true ? "1" : "0";

		this.doPush( "led", sOperand );
	},

	onButtonPress: function( oEvent ) {
		var sOperand = this.getView().oInput.getValue();

		this.doPush( "display", sOperand );
	},

	doPush: function( sOpcode, sOperand ) {
		var oData = {
			sender: "My IoT application",
			messageType: this.getView().oMessageSelect.getSelectedItem().getKey(),
			method: this.getView().oSegmentedButton.getSelectedKey(),
			messages: [ {
				opcode: sOpcode,
				operand: sOperand
			} ]
		};

		console.debug( oData );

		var successHandler = function( oData, textStatus, jqXHR ) {
			sap.m.MessageToast.show( oData.msg );
		};

		var sDevice = this.getView().oDeviceSelect.getSelectedItem().getKey();

		var sUrl = "data/push/".concat( sDevice );
		console.debug( sUrl );

		this.doPost( sUrl, oData, successHandler );
	}

} );