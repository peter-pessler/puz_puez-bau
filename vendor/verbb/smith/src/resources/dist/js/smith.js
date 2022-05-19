void 0===Craft.Smith&&(Craft.Smith={}),function($){Craft.Smith.Init=Garnish.Base.extend({smithMenus:[],init:function(t){Garnish.requestAnimationFrame($.proxy((function(){for(var t=Garnish.$doc.find(".matrix-field"),a=0;a<t.length;a++)for(var e=$(t[a]),i=e.find("> .blocks > .matrixblock"),s=0;s<i.length;s++){var r=$(i[s]),n=r.find(".actions .settings.menubtn");r.hasClass("static")||this.smithMenus.push(new Craft.Smith.Menu(e,r,i))}Garnish.on(Craft.MatrixInput,"blockAdded",$.proxy(this,"blockAdded")),Craft.SuperTable&&Craft.SuperTable.MatrixInputAlt&&Garnish.on(Craft.SuperTable.MatrixInputAlt,"blockAdded",$.proxy(this,"blockAdded"))}),this))},blockAdded:function(t){Garnish.requestAnimationFrame($.proxy((function(){var a=t.target.$container,e=a.find("> .blocks > .matrixblock"),i=$(t.$block),s;i.data("block")?($.each(this.smithMenus,(function(t,a){a.$matrixBlocks=e})),i.hasClass("static")||this.smithMenus.push(new Craft.Smith.Menu(a,i,e))):this.blockAdded(t)}),this))}}),Craft.Smith.Menu=Garnish.Base.extend({init:function(t,a,e){this.$matrixField=t,this.$matrixBlock=a,this.$matrixBlocks=e,this.blockInstance=this.$matrixBlock.data("block");var i=this.blockInstance.$actionMenu.find('a[data-action="delete"]').parents("li");this.$copyBtn=$('<a data-icon="copy" data-action="copy">'+Craft.t("app","Copy")+"</a>"),this.$pasteBtn=$('<a data-icon="paste" data-action="paste">'+Craft.t("app","Paste")+"</a>"),this.$cloneBtn=$('<a data-icon="clone" data-action="clone">'+Craft.t("app","Clone")+"</a>"),this.$copyBtn.insertBefore(i).wrap("<li/>"),this.$pasteBtn.insertBefore(i).wrap("<li/>"),this.$cloneBtn.insertBefore(i).wrap("<li/>"),$('<hr class="padded">').insertBefore(i),this.addListener(this.$copyBtn,"click",this.handleClick),this.addListener(this.$pasteBtn,"click",this.handleClick),this.addListener(this.$cloneBtn,"click",this.handleClick),this.checkPaste()},handleClick:function(t){var a=$(t.target);a.hasClass("disabled")||a.hasClass("sel")||("copy"==a.data("action")&&this.copyBlock(t),"paste"==a.data("action")&&this.pasteBlock(t),"clone"==a.data("action")&&this.cloneBlock(t),this.blockInstance.actionDisclosure.hide())},checkPaste:function(){var t=!1;try{var a=JSON.parse(localStorage.getItem("smith:block")),e=this.$matrixField.attr("id");a&&e.includes("fields-"+a.field)&&(t=!0)}catch(t){}t?this.$pasteBtn.enable():this.$pasteBtn.disable()},copyBlock:function(t){var a=this._serializeBlocks();localStorage.setItem("smith:block",JSON.stringify(a));var e=a.blocks.length,i=1==e?"1 block copied":"{n} blocks copied";Craft.cp.displayNotice(Craft.t("app",i,{n:e})),this.checkPaste()},pasteBlock:function(t,a){try{if(!a)var a=JSON.parse(localStorage.getItem("smith:block"));var e=this.$matrixField.find(".blocks"),i=$('<div class="spinner smith-spinner"></div>').insertAfter(this.$matrixBlock),s=this.$matrixField.data("matrix"),r=i;a.placeholderKey=s.settings.placeholderKey,Craft.postActionRequest("smith/field/render-matrix-blocks",a,$.proxy((function(t,a){if("success"===a&&t.success)for(var e=0;e<t.blocks.length;e++){var n=t.blocks[e],c=s.blockTypesByHandle[n.typeHandle];s.blockTypesByHandle[n.typeHandle]=n;var l=s.addBlock(n.typeHandle,r);s.blockTypesByHandle[n.typeHandle]=c}i.remove()}),this))}catch(t){}},cloneBlock:function(t){var a=this._serializeBlocks();this.pasteBlock(t,a)},_serializeBlocks:function(){var t={field:"",namespace:"",blocks:[]},a=this.$matrixField.data("matrix"),e=a.blockSelect.$selectedItems;t.placeholderKey=a.settings.placeholderKey,e.length||(e=this.$matrixBlock);for(var i=0;i<e.length;i++){var s=$(e[i]),r=Garnish.getPostData(s),n={};for(var c in r){var l=r[c],o=a.inputNamePrefix.replace(/(^fields).*(\[.+\])/,"$1$2");t.namespace=a.inputNamePrefix.match(/fields.*\[fields\]/)?.[0]||"",n[c=o+c.replace(a.inputNamePrefix,"")]=l}var h,d=Craft.expandPostArray(n).fields;for(var f in d)for(var p in t.field=f,d[f].blocks){var k=d[f].blocks[p];k.blockId=s.data("id"),t.blocks.push(k)}}return t=this.filterBlocks(t)},filterBlocks:function(t){var a=this;if(t.blocks&&Array.isArray(t.blocks)&&(t.blocks=t.blocks.filter((function(t){return null!=t})),t.sortOrder)){for(var e=[],i=0;i<t.blocks.length;i++)e.push(i);t.sortOrder=e}return Object.keys(t).forEach((function(e){var i=t[e];if(Array.isArray())for(var s=0;s<i.length;s++)a.filterBlocks(i[s]);"object"==typeof i&&a.filterBlocks(i)})),t}})}(jQuery);
//# sourceMappingURL=smith.js.map