"undefined"==typeof Verbb&&(Verbb={}),function(t){Verbb.UI=Garnish.Base.extend({init:function(){this.$tabsContainer=t("[data-vui-tabs]"),this.$tabsContainer.length&&new Verbb.UI.SimpleTabs(this.$tabsContainer)}}),Verbb.UI.SimpleTabs=Garnish.Base.extend({$container:null,$ul:null,$tabs:null,$selectedTab:null,$focusableTab:null,init:function(e){this.$container=t(e),this.$ul=this.$container.find("> ul:first"),this.$tabs=this.$ul.find("> li > a"),this.$selectedTab=this.$tabs.filter(".sel:first"),this.$focusableTab=this.$tabs.filter("[tabindex=0]:first"),this.$container.data("tabs")&&(Garnish.log("Double-instantiating a tab manager on an element"),this.$container.data("tabs").destroy()),this.$container.data("tabs",this);for(let e=0;e<this.$tabs.length;e++){const s=this.$tabs.eq(e),a=s.attr("href");a&&"#"===a.charAt(0)&&(this.addListener(s,"keydown",(t=>{[Garnish.SPACE_KEY,Garnish.RETURN_KEY].includes(t.keyCode)&&(t.preventDefault(),this.selectTab(t.currentTarget))})),this.addListener(s,"click",(e=>{e.preventDefault();const s=t(e.currentTarget);this.selectTab(e.currentTarget),this.makeTabFocusable(e.currentTarget)})),a.substr(1)===window.LOCATION_HASH&&($initialTab=s)),this.addListener(s,"keydown",(e=>{if([Garnish.DOWN_KEY,Garnish.UP_KEY].includes(e.keyCode)&&t.contains(this.$ul[0],e.currentTarget)){let i;if(e.keyCode===Garnish.UP_KEY){var s=t(e.currentTarget).parent().prev("li");s.hasClass("heading")&&(s=s.prev("li")),i=s.children("a")}else{var a=t(e.currentTarget).parent().next("li");a.hasClass("heading")&&(a=a.next("li")),i=a.children("a")}i.length&&(e.preventDefault(),this.makeTabFocusable(i),i.focus(),this.scrollToTab(i))}}))}if(window.LOCATION_HASH){const t=this.$tabs.filter(`[href="#${window.LOCATION_HASH}"]`);t.length&&this.selectTab(t)}},selectTab:function(e){const s=this._getTab(e);if(s[0]===this.$selectedTab[0])return;this.deselectTab(),this.$selectedTab=s.addClass("sel"),this.makeTabFocusable(s),this.scrollToTab(s),this.trigger("selectTab",{$tab:s});const a=s.attr("href");"#"===a.charAt(0)&&t(a).removeClass("hidden"),Garnish.$win.trigger("resize"),Garnish.$doc.trigger("scroll"),"undefined"!=typeof history&&Garnish.requestAnimationFrame((()=>{history.replaceState(void 0,void 0,a)}))},deselectTab:function(){const e=this.$selectedTab.removeClass("sel");this.$selectedTab=null,this.trigger("deselectTab",{$tab:e}),"#"===e.attr("href").charAt(0)&&t(e.attr("href")).addClass("hidden")},makeTabFocusable:function(t){const e=this._getTab(t);e[0]!==this.$focusableTab[0]&&(this.$focusableTab.attr("tabindex","-1"),this.$focusableTab=e.attr("tabindex","0"))},scrollToTab:function(t){const e=this._getTab(t),s=this.$ul.scrollLeft(),a=undefined,i=e.offset().left-this.$ul.offset().left;let n=!1;if(i<0)n=s+i-24;else{const t=e.outerWidth(),a=this.$ul.prop("clientWidth");i+t>a&&(n=s+(i-(a-t))+24)}!1!==n&&this.$ul.scrollLeft(n)},_getTab:function(e){if(e instanceof jQuery)return e;if(e instanceof HTMLElement)return t(e);if("string"!=typeof e)throw"Invalid tab ID";const s=this.$tabs.filter(`[data-id="${e}"]`);if(!s.length)throw`Invalid tab ID: ${e}`;return s}}),new Verbb.UI}(jQuery);
//# sourceMappingURL=verbb-ui.js.map