// ==========================================================================

// Smith Plugin for Craft CMS
// Author: Verbb - https://verbb.io/

// ==========================================================================

if (typeof Craft.Smith === typeof undefined) {
    Craft.Smith = {};
}

(function($) {

Craft.Smith.Init = Garnish.Base.extend({
    smithMenus: [],

    init: function(options) {
        Garnish.requestAnimationFrame($.proxy(function() {
            var $matrixFields = Garnish.$doc.find('.matrix-field');

            for (var i = 0; i < $matrixFields.length; i++) {
                var $matrixField = $($matrixFields[i]);
                var $matrixBlocks = $matrixField.find('> .blocks > .matrixblock');

                for (var j = 0; j < $matrixBlocks.length; j++) {
                    var $matrixBlock = $($matrixBlocks[j]);
                    var $settingsBtn = $matrixBlock.find('.actions .settings.menubtn');

                    // Don't do this for static blocks
                    if ($matrixBlock.hasClass('static')) {
                        continue;
                    }

                    // Create a new class for this specific Matrix field and block
                    this.smithMenus.push(new Craft.Smith.Menu($matrixField, $matrixBlock, $matrixBlocks));
                }
            }

            // Create a callback for new blocks
            Garnish.on(Craft.MatrixInput, 'blockAdded', $.proxy(this, 'blockAdded'));

            // Allow for Super Table's nested Matrix JS
            if (Craft.SuperTable && Craft.SuperTable.MatrixInputAlt) {
                Garnish.on(Craft.SuperTable.MatrixInputAlt, 'blockAdded', $.proxy(this, 'blockAdded'));
            }
        }, this));
    },

    blockAdded: function(e) {
        Garnish.requestAnimationFrame($.proxy(function() {
            var $matrixField = e.target.$container;
            var $matrixBlocks = $matrixField.find('> .blocks > .matrixblock');
            var $matrixBlock = $(e.$block);

            var blockInstance = $matrixBlock.data('block');

            // Try again if the menu button isn't initialised yet
            if (!blockInstance) {
                this.blockAdded(e);
                return;
            }

            // Update all Smith menus' with the correct matrix blocks
            $.each(this.smithMenus, function(index, menu) {
                menu.$matrixBlocks = $matrixBlocks;
            });

            // Don't do this for static blocks
            if ($matrixBlock.hasClass('static')) {
                return;
            }

            // Create a new Smith menu class for the new block
            this.smithMenus.push(new Craft.Smith.Menu($matrixField, $matrixBlock, $matrixBlocks));
        }, this));
    },
});

Craft.Smith.Menu = Garnish.Base.extend({
    init: function($matrixField, $matrixBlock, $matrixBlocks) {
        this.$matrixField = $matrixField;
        this.$matrixBlock = $matrixBlock;
        this.$matrixBlocks = $matrixBlocks;

        this.blockInstance = this.$matrixBlock.data('block');

        // Keep track of the delete option - we want to insert before that
        var $deleteOption = this.blockInstance.$actionMenu.find('a[data-action="delete"]').parents('li');

        // Create our buttons
        this.$copyBtn = $('<a data-icon="copy" data-action="copy">' + Craft.t('app', 'Copy') + '</a>');
        this.$pasteBtn = $('<a data-icon="paste" data-action="paste">' + Craft.t('app', 'Paste') + '</a>');
        this.$cloneBtn = $('<a data-icon="clone" data-action="clone">' + Craft.t('app', 'Clone') + '</a>');

        // Add new menu items to the DOM
        this.$copyBtn.insertBefore($deleteOption).wrap('<li/>');
        this.$pasteBtn.insertBefore($deleteOption).wrap('<li/>');
        this.$cloneBtn.insertBefore($deleteOption).wrap('<li/>');
        $('<hr class="padded">').insertBefore($deleteOption);

        this.addListener(this.$copyBtn, 'click', this.handleClick);
        this.addListener(this.$pasteBtn, 'click', this.handleClick);
        this.addListener(this.$cloneBtn, 'click', this.handleClick);

        // Perform some checks
        this.checkPaste();
    },

    handleClick: function(e) {
        var $option = $(e.target);

        if ($option.hasClass('disabled') || $option.hasClass('sel')) {
            return;
        }

        if ($option.data('action') == 'copy') {
            this.copyBlock(e);
        }

        if ($option.data('action') == 'paste') {
            this.pasteBlock(e);
        }

        if ($option.data('action') == 'clone') {
            this.cloneBlock(e);
        }

        this.blockInstance.actionDisclosure.hide();
    },


    checkPaste: function() {
        var canPaste = false;

        try {
            var data = JSON.parse(localStorage.getItem('smith:block'));
            var fieldHandle = this.$matrixField.attr('id');

            // Find copy data for this field
            if (data && fieldHandle.includes('fields-' + data.field)) {
                canPaste = true;
            }
        } catch(e) { }

        if (!canPaste) {
            this.$pasteBtn.disable();
        } else {
            this.$pasteBtn.enable();
        }
    },

    copyBlock: function(e) {
        var data = this._serializeBlocks();

        localStorage.setItem('smith:block', JSON.stringify(data));

        var count = data.blocks.length;
        var message = count == 1 ? '1 block copied' : '{n} blocks copied';

        Craft.cp.displayNotice(Craft.t('app', message, { n: count }));

        this.checkPaste();
    },

    pasteBlock: function(e, data) {
        try {
            if (!data) {
                var data = JSON.parse(localStorage.getItem('smith:block'));
            }

            var $blockContainer = this.$matrixField.find('.blocks');
            var $spinner = $('<div class="spinner smith-spinner"></div>').insertAfter(this.$matrixBlock);

            // Get the Matrix field JS instance
            var matrixField = this.$matrixField.data('matrix');

            // Figure out the next block, to instruct Matrix to insert before that one
            var $insertBefore = $spinner;

            // Have to replace the placeholderKey from the copied matrix. Very likely its been copied on one
            // field, and pasted on another so that placeholderKey will be different.
            data.placeholderKey = matrixField.settings.placeholderKey;

            // Fetch the blocks, rendered with values
            Craft.postActionRequest('smith/field/render-matrix-blocks', data, $.proxy(function(response, textStatus) {
                if (textStatus === 'success' && response.success) {
                    for (var i = 0; i < response.blocks.length; i++) {
                        var block = response.blocks[i];

                        // Save the blocktype content
                        var originalBlock = matrixField.blockTypesByHandle[block.typeHandle];

                        // Prep the Matrix field to know about our updated blocks (with rendered content)
                        matrixField.blockTypesByHandle[block.typeHandle] = block;

                        // Trigger the addBlock function - this adds a new block, so we're not duplicating code
                        var $newBlock = matrixField.addBlock(block.typeHandle, $insertBefore);

                        // Then, re-set back, so new blocks don't use copied content
                        matrixField.blockTypesByHandle[block.typeHandle] = originalBlock;
                    };
                }

                // Hide the spinner
                $spinner.remove();
            }, this));
        } catch(e) { }
    },

    cloneBlock: function(e) {
        var data = this._serializeBlocks();

        this.pasteBlock(e, data);
    },

    _serializeBlocks: function() {
        var data = {
            field: '',
            namespace: '',
            blocks: []
        };

        var matrixField = this.$matrixField.data('matrix');
        var $selectedItems = matrixField.blockSelect.$selectedItems;

        data.placeholderKey = matrixField.settings.placeholderKey;

        if (!$selectedItems.length) {
            $selectedItems = this.$matrixBlock;
        }

        for (var i = 0; i < $selectedItems.length; i++) {
            var $blockItem = $($selectedItems[i]);

            var postData = Garnish.getPostData($blockItem);

            // In order to deal with nested fields (ST > Matrix, Matrix > ST, Matrix > ST > Matrix), we need to
            // splice up the post data to just contain values for _this_ Matrix block, rather than them
            // namespaced to the top-level field.
            var parsedPostData = {};

            for (var paramHandle in postData) {
                var paramValue = postData[paramHandle];

                // This will be `fields[matrixField]` where `matrixField` will be **this** field.
                // Factoring in nested fields and all that. We want this to help extract POST data
                // just for this block.
                var fieldNamespace = matrixField.inputNamePrefix.replace(/(^fields).*(\[.+\])/, '$1$2');

                // Get the namespace for the block, including any nested names. We use this to generate
                // the correct name inputs for the new fields. Will either be blank for solo Matrix
                // Or as complex as `fields[field][blocks][id][fields][field][blocks][id][fields]`
                data.namespace = matrixField.inputNamePrefix.match(/fields.*\[fields\]/)?.[0] || '';

                // Remove everything up to the last `[fields][matrixField][blocks]` pattern to deal
                // with (ST > Matrix, Matrix > ST, Matrix > ST > Matrix) combos. Be sure to prepend
                // `fields[matrixField]` to fetch POST data correctly, scoped to this block.
                paramHandle = fieldNamespace + paramHandle.replace(matrixField.inputNamePrefix, '');

                parsedPostData[paramHandle] = paramValue;
            }

            var params = Craft.expandPostArray(parsedPostData);

            var fields = params.fields;

            for (var fieldHandle in fields) {
                data.field = fieldHandle;

                for (var blockId in fields[fieldHandle].blocks) {
                    var block = fields[fieldHandle].blocks[blockId];

                    // Save the block ID for later
                    block.blockId = $blockItem.data('id');

                    data.blocks.push(block);
                }
            }
        }

        // Cleanup nested block data. Massive pain, but seems related to delta updates.
        // Basically helps to prevent heaps of empty data sent to the server.
        data = this.filterBlocks(data);

        return data;
    },

    filterBlocks: function(object) {
        var self = this;

        if (object.blocks && Array.isArray(object.blocks)) {
            object.blocks = object.blocks.filter(function(el) {
                return el != null;
            });

            // Fix the sort order too, won't work otherwise.
            if (object.sortOrder) {
                var sortOrder = [];

                for (var i = 0; i < object.blocks.length; i++) {
                    sortOrder.push(i)
                }

                object.sortOrder = sortOrder;
            }
        }

        Object.keys(object).forEach(function(index) {
            var item  = object[index];

            if (Array.isArray()) {
                for (var i = 0; i < item.length; i++) {
                    self.filterBlocks(item[i]);
                }
            }

            if (typeof item === 'object') {
                self.filterBlocks(item);
            }
        });
        
        return object;
    }

});


})(jQuery);
