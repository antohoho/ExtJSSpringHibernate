Ext.onReady(function(){

	

	var myData = {
		records : [
				{ name : "Rec 0", column1 : "0", column2 : "0" },
				{ name : "Rec 1", column1 : "1", column2 : "1" },
				{ name : "Rec 2", column1 : "2", column2 : "2" },
				{ name : "Rec 3", column1 : "3", column2 : "3" },
				{ name : "Rec 4", column1 : "4", column2 : "4" },
				{ name : "Rec 5", column1 : "5", column2 : "5" },
				{ name : "Rec 6", column1 : "6", column2 : "6" },
				{ name : "Rec 7", column1 : "7", column2 : "7" },
				{ name : "Rec 8", column1 : "8", column2 : "8" },
				{ name : "Rec 9", column1 : "9", column2 : "9" }
			]
		};


		// Generic fields array to use in both store defs.
		var fields = [
			{name: 'name', mapping : 'name'},
			{name: 'column1', mapping : 'column1'},
			{name: 'column2', mapping : 'column2'}
		];

	    // create the data store
	    var firstGridStore = new Ext.data.JsonStore({
	        fields : fields,
			data   : myData,
			root   : 'records'
	    });


		// Column Model shortcut array
		var cols = [
			{ id : 'name', header: "Record Name", width: 160, sortable: true, dataIndex: 'name'},
			{header: "column1", width: 50, sortable: true, dataIndex: 'column1'},
			{header: "column2", width: 50, sortable: true, dataIndex: 'column2'}
		];

		// declare the source Grid
	    var firstGrid = new Ext.grid.GridPanel({
	    	ddGroup          : 'secondGridDDGroup',
	        store            : firstGridStore,
	        columns          : cols,
	        enableDragDrop   : true,
	        stripeRows       : true,
	        autoExpandColumn : 'name',
	        title            : 'First Grid'
	    });

	    var secondGridStore = new Ext.data.JsonStore({
	        fields : fields,
			root   : 'records'
	    });

	    // create the destination Grid
	    var secondGrid = new Ext.grid.GridPanel({
	    	ddGroup          : 'firstGridDDGroup',
	        store            : secondGridStore,
	        columns          : cols,
	        enableDragDrop   : true,
	        stripeRows       : true,
	        autoExpandColumn : 'name',
	        title            : 'Second Grid'
	    });


		//Simple 'border layout' panel to house both grids
		var displayPanel = new Ext.Panel({
			width        : 650,
			height       : 300,
			layout       : 'hbox',
			renderTo     : 'panel',
			defaults     : { flex : 1 }, //auto stretch
			layoutConfig : { align : 'stretch' },
			items        : [
				firstGrid,
				secondGrid
			],
			bbar    : [
				'->', // Fill
				{
					text    : 'Reset both grids',
					handler : function() {
						//refresh source grid
						firstGridStore.loadData(myData);

						//purge destination grid
						secondGridStore.removeAll();
					}
				}
			]
		});

		// used to add records to the destination stores
		var blankRecord =  Ext.data.Record.create(fields);

	        /****
	        * Setup Drop Targets
	        ***/
	        // This will make sure we only drop to the  view scroller element
	        var firstGridDropTargetEl =  firstGrid.getView().scroller.dom;
	        var firstGridDropTarget = new Ext.dd.DropTarget(firstGridDropTargetEl, {
	                ddGroup    : 'firstGridDDGroup',
	                notifyDrop : function(ddSource, e, data){
	                        var records =  ddSource.dragData.selections;
	                        Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
	                        firstGrid.store.add(records);
	                        firstGrid.store.sort('name', 'ASC');
	                        return true
	                }
	        });


	        // This will make sure we only drop to the view scroller element
	        var secondGridDropTargetEl = secondGrid.getView().scroller.dom;
	        var secondGridDropTarget = new Ext.dd.DropTarget(secondGridDropTargetEl, {
	                ddGroup    : 'secondGridDDGroup',
	                notifyDrop : function(ddSource, e, data){
	                        var records =  ddSource.dragData.selections;
	                        Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
	                        secondGrid.store.add(records);
	                        secondGrid.store.sort('name', 'ASC');
	                        return true
	                }
	        });	
	
	
	
	
	
	
	
	
	
	Ext.BLANK_IMAGE_URL = '/extjs-crud-grid/ext-3.2.1/resources/images/default/s.gif';
	
    var Contact = Ext.data.Record.create([
	{name: 'id'},
    {
        name: 'name',
        type: 'string'
    }, {
        name: 'phone',
        type: 'string'
    }, {
        name: 'email',
        type: 'string'
    }]);
    
    var proxy = new Ext.data.HttpProxy({
        api: {
            read : 'contact/view.action',
            create : 'contact/create.action',
            update: 'contact/update.action',
            destroy: 'contact/delete.action'
        }
    });
    
    var reader = new Ext.data.JsonReader({
        totalProperty: 'total',
        successProperty: 'success',
        idProperty: 'id',
        root: 'data',
        messageProperty: 'message'  // <-- New "messageProperty" meta-data
    }, 
    Contact);

 // The new DataWriter component.
    var writer = new Ext.data.JsonWriter({
        encode: true,
        writeAllFields: true
    });
    
 // Typical Store collecting the Proxy, Reader and Writer together.
    var store = new Ext.data.Store({
        id: 'user',
        proxy: proxy,
        reader: reader,
        writer: writer,  // <-- plug a DataWriter into the store just as you would a Reader
        autoSave: false // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
    });

    //read the data from simple array
    store.load();
    
    Ext.data.DataProxy.addListener('exception', function(proxy, type, action, options, res) {
    	Ext.Msg.show({
    		title: 'ERROR',
    		msg: res.message,
    		icon: Ext.MessageBox.ERROR,
    		buttons: Ext.Msg.OK
    	});
    });

    
    var editor = new Ext.ux.grid.RowEditor({
        saveText: 'Update'
    });
    
    var ajaxTableCol =  [{header: "NAME", 	 width: 170, sortable: true, dataIndex: 'name',  editor: {xtype: 'textfield', allowBlank: false}},
                         {header: "PHONE #", width: 160, sortable: true, dataIndex: 'phone', editor: {xtype: 'textfield', allowBlank: false}},
                         {header: "EMAIL",   width: 170, sortable: true, dataIndex: 'email', editor: {xtype: 'textfield', allowBlank: false}}];
    

    // create grid
    var grid = new Ext.grid.GridPanel({
    	ddGroup: 	'secondGridDDGroupAjax',
        store: 		store,
        columns: 	ajaxTableCol,
        viewConfig:	{forcefit:true},
        plugins: 	[editor],
        title: 		'My Contacts',
        enableDragDrop   : true,
        height: 	300,
        width:		535,
		frame:		true,
				tbar: [{
		            iconCls: 'icon-user-add',
		            text: 'Add Contact',
		            handler: function(){
		                var e = new Contact({
		                    name: 'New Guy',
		                    phone: '(000) 000-0000',
		                    email: 'new@ltest.com'
		                });
		                editor.stopEditing();
		                store.insert(0, e);
		                grid.getView().refresh();
		                grid.getSelectionModel().selectRow(0);
		                editor.startEditing(0);
		            }
		        },{
		            iconCls: 'icon-user-delete',
		            text: 'Remove Contact',
		            handler: function(){
		                editor.stopEditing();
		                var s = grid.getSelectionModel().getSelections();
		                for(var i = 0, r; r = s[i]; i++){
		                    store.remove(r);
		                }
		            }
		        },{
		            iconCls: 'icon-user-save',
		            text: 'Save All Modifications',
		            handler: function(){
		                store.save();
		            }
		        }]
    });

    
    var fields = [
          		{name: 'name', mapping : 'name'},
          		{name: 'column1', mapping : 'column1'},
          		{name: 'column2', mapping : 'column2'}
          	];
    
    var secondGridStoreAjax = new Ext.data.JsonStore({
        fields : Contact,
		root   : 'records'
    });
    
    var grid2 = new Ext.grid.GridPanel({
    	ddGroup: 	'firstGridDDGroupAjax',
        store: 		secondGridStoreAjax,
        columns: 	ajaxTableCol,
        viewConfig:	{forcefit:true},
        plugins: 	[editor],
        title: 		'My Contacts',
        enableDragDrop   : true,
        height: 	300,
        width:		535,
		frame:		true,
				tbar: [{
		            iconCls: 'icon-user-add',
		            text: 'Add Contact',
		            handler: function(){
		                var e = new Contact({
		                    name: 'New Guy',
		                    phone: '(000) 000-0000',
		                    email: 'new@ltest.com'
		                });
		                editor.stopEditing();
		                store.insert(0, e);
		                grid.getView().refresh();
		                grid.getSelectionModel().selectRow(0);
		                editor.startEditing(0);
		            }
		        },{
		            iconCls: 'icon-user-delete',
		            text: 'Remove Contact',
		            handler: function(){
		                editor.stopEditing();
		                var s = grid.getSelectionModel().getSelections();
		                for(var i = 0, r; r = s[i]; i++){
		                    store.remove(r);
		                }
		            }
		        },{
		            iconCls: 'icon-user-save',
		            text: 'Save All Modifications',
		            handler: function(){
		                store.save();
		            }
		        }]
    });
    
    
    
    
    
    
    var displayPanel2 = new Ext.Panel({
		width        : 1400,
		height       : 350,
		layout       : 'hbox',
		renderTo     : 'crud-grid',
		defaults     : { flex : 1 }, //auto stretch
		layoutConfig : { align : 'stretch' },
		items        : [ grid, grid2 ],
		bbar    : [
			'->', // Fill
			{
				text    : 'Reset both grids',
				handler : function() {
					//refresh source grid
					//store.loadData(myData);

					//purge destination grid
					secondGridStore.removeAll();
				}
			}
		]
	});
    
    
    
    
    
    /****
     * Setup Drop Targets
     ***/
     // This will make sure we only drop to the  view scroller element
     var firstGridDropTargetElAjax =  grid.getView().scroller.dom;
     var firstGridDropTargetAjax = new Ext.dd.DropTarget(firstGridDropTargetElAjax, {
             ddGroup    : 'firstGridDDGroupAjax',
             notifyDrop : function(ddSource, e, data){
                     var records =  ddSource.dragData.selections;
                     Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
                     grid.store.add(records);
                     grid.store.sort('name', 'ASC');
                     return true
             }
     });


     // This will make sure we only drop to the view scroller element
     var secondGridDropTargetElAjax = grid2.getView().scroller.dom;
     var secondGridDropTargetAjax = new Ext.dd.DropTarget(secondGridDropTargetElAjax, {
             ddGroup    : 'secondGridDDGroupAjax',
             notifyDrop : function(ddSource, e, data){
                     var records =  ddSource.dragData.selections;
                     Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
                     grid2.store.add(records);
                     grid2.store.sort('name', 'ASC');
                     return true
             }
     });	

    
    
    
    
    
    
    
    
    
    
    

    //render to DIV
    //grid.render('crud-grid');
});