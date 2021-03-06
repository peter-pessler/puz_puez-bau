/** global: Craft */
/** global: Garnish */
/**
 * Customize Sources modal
 */
Craft.CustomizeSourcesModal = Garnish.Modal.extend({
  elementIndex: null,
  $elementIndexSourcesContainer: null,

  $sidebar: null,
  $sourcesContainer: null,
  $sourceSettingsContainer: null,
  $newHeadingBtn: null,
  $footer: null,
  $footerBtnContainer: null,
  $saveBtn: null,
  $cancelBtn: null,
  $saveSpinner: null,
  $loadingSpinner: null,

  sourceSort: null,
  sources: null,
  selectedSource: null,
  updateSourcesOnSave: false,

  availableTableAttributes: null,

  init: function (elementIndex, settings) {
    this.base();

    this.setSettings(settings, {
      resizable: true,
    });

    this.elementIndex = elementIndex;
    this.$elementIndexSourcesContainer = this.elementIndex.$sidebar
      .children('nav')
      .children('ul');

    var $container = $(
      '<form class="modal customize-sources-modal"/>'
    ).appendTo(Garnish.$bod);

    this.$sidebar = $('<div class="cs-sidebar block-types"/>').appendTo(
      $container
    );
    this.$sourcesContainer = $('<div class="sources">').appendTo(this.$sidebar);
    this.$sourceSettingsContainer = $('<div class="source-settings">').appendTo(
      $container
    );

    this.$footer = $('<div class="footer"/>').appendTo($container);
    this.$footerBtnContainer = $('<div class="buttons right"/>').appendTo(
      this.$footer
    );
    this.$cancelBtn = $('<button/>', {
      type: 'button',
      class: 'btn',
      text: Craft.t('app', 'Cancel'),
    }).appendTo(this.$footerBtnContainer);
    this.$saveBtn = $('<button/>', {
      type: 'button',
      class: 'btn submit disabled',
      text: Craft.t('app', 'Save'),
    }).appendTo(this.$footerBtnContainer);
    this.$saveSpinner = $('<div class="spinner hidden"/>').appendTo(
      this.$footerBtnContainer
    );
    this.$newHeadingBtn = $('<button/>', {
      type: 'button',
      class: 'btn submit add icon',
      text: Craft.t('app', 'New heading'),
    }).appendTo(
      $('<div class="buttons left secondary-buttons"/>').appendTo(this.$footer)
    );

    this.$loadingSpinner = $('<div class="spinner"/>').appendTo($container);

    this.setContainer($container);
    this.show();

    var data = {
      elementType: this.elementIndex.elementType,
    };

    Craft.postActionRequest(
      'element-index-settings/get-customize-sources-modal-data',
      data,
      (response, textStatus) => {
        this.$loadingSpinner.remove();

        if (textStatus === 'success') {
          this.$saveBtn.removeClass('disabled');
          this.buildModal(response);
        }
      }
    );

    this.addListener(this.$newHeadingBtn, 'click', 'handleNewHeadingBtnClick');
    this.addListener(this.$cancelBtn, 'click', 'hide');
    this.addListener(this.$saveBtn, 'click', 'save');
    this.addListener(this.$container, 'submit', 'save');
  },

  buildModal: function (response) {
    // Store the available table attribute options
    this.availableTableAttributes = response.availableTableAttributes;

    // Create the source item sorter
    this.sourceSort = new Garnish.DragSort({
      handle: '.move',
      axis: 'y',
      onSortChange: () => {
        this.updateSourcesOnSave = true;
      },
    });

    // Create the sources
    this.sources = [];

    for (var i = 0; i < response.sources.length; i++) {
      var source = this.addSource(response.sources[i]);
      this.sources.push(source);
    }

    if (!this.selectedSource && typeof this.sources[0] !== 'undefined') {
      this.sources[0].select();
    }
  },

  addSource: function (sourceData) {
    var $item = $('<div class="customize-sources-item"/>').appendTo(
      this.$sourcesContainer
    );
    var $itemLabel = $('<div class="label"/>').appendTo($item);
    var $itemInput = $('<input type="hidden"/>').appendTo($item);
    $(
      '<a class="move icon" title="' +
        Craft.t('app', 'Reorder') +
        '" role="button"></a>'
    ).appendTo($item);

    var source;

    // Is this a heading?
    if (typeof sourceData.heading !== 'undefined') {
      $item.addClass('heading');
      $itemInput.attr('name', 'sourceOrder[][heading]');
      source = new Craft.CustomizeSourcesModal.Heading(
        this,
        $item,
        $itemLabel,
        $itemInput,
        sourceData
      );
      source.updateItemLabel(sourceData.heading);
    } else {
      $itemInput.attr('name', 'sourceOrder[][key]').val(sourceData.key);
      source = new Craft.CustomizeSourcesModal.Source(
        this,
        $item,
        $itemLabel,
        $itemInput,
        sourceData
      );
      source.updateItemLabel(sourceData.label);

      // Select this by default?
      if (
        (this.elementIndex.sourceKey + '/').substr(
          0,
          sourceData.key.length + 1
        ) ===
        sourceData.key + '/'
      ) {
        source.select();
      }
    }

    this.sourceSort.addItems($item);

    return source;
  },

  handleNewHeadingBtnClick: function () {
    var source = this.addSource({
      heading: '',
    });

    Garnish.scrollContainerToElement(this.$sidebar, source.$item);

    source.select();
    this.updateSourcesOnSave = true;
  },

  save: function (ev) {
    if (ev) {
      ev.preventDefault();
    }

    if (
      this.$saveBtn.hasClass('disabled') ||
      !this.$saveSpinner.hasClass('hidden')
    ) {
      return;
    }

    this.$saveSpinner.removeClass('hidden');
    var data =
      this.$container.serialize() +
      '&elementType=' +
      this.elementIndex.elementType;

    Craft.postActionRequest(
      'element-index-settings/save-customize-sources-modal-settings',
      data,
      (response, textStatus) => {
        this.$saveSpinner.addClass('hidden');

        if (textStatus === 'success' && response.success) {
          // Have any changes been made to the source list?
          if (this.updateSourcesOnSave) {
            if (this.$elementIndexSourcesContainer.length) {
              var $lastSource = null,
                $pendingHeading;

              for (var i = 0; i < this.sourceSort.$items.length; i++) {
                var $item = this.sourceSort.$items.eq(i),
                  source = $item.data('source'),
                  $indexSource = source.getIndexSource();

                if (!$indexSource) {
                  continue;
                }

                if (source.isHeading()) {
                  $pendingHeading = $indexSource;
                } else {
                  if ($pendingHeading) {
                    this.appendSource($pendingHeading, $lastSource);
                    $lastSource = $pendingHeading;
                    $pendingHeading = null;
                  }

                  this.appendSource($indexSource, $lastSource);
                  $lastSource = $indexSource;
                }
              }

              // Remove any additional sources (most likely just old headings)
              if ($lastSource) {
                var $extraSources = $lastSource.nextAll();
                this.elementIndex.sourceSelect.removeItems($extraSources);
                $extraSources.remove();
              }
            }
          }

          // If a source is selected, have the element index select that one by default on the next request
          if (this.selectedSource && this.selectedSource.sourceData.key) {
            this.elementIndex.selectSourceByKey(
              this.selectedSource.sourceData.key
            );
            this.elementIndex.updateElements();
          }

          Craft.cp.displayNotice(Craft.t('app', 'Source settings saved'));
          this.hide();
        } else {
          var error =
            textStatus === 'success' && response.error
              ? response.error
              : Craft.t('app', 'A server error occurred.');
          Craft.cp.displayError(error);
        }
      }
    );
  },

  appendSource: function ($source, $lastSource) {
    if (!$lastSource) {
      $source.prependTo(this.$elementIndexSourcesContainer);
    } else {
      $source.insertAfter($lastSource);
    }
  },

  destroy: function () {
    for (var i = 0; i < this.sources.length; i++) {
      this.sources[i].destroy();
    }

    delete this.sources;
    this.base();
  },
});

Craft.CustomizeSourcesModal.BaseSource = Garnish.Base.extend({
  modal: null,

  $item: null,
  $itemLabel: null,
  $itemInput: null,
  $settingsContainer: null,

  sourceData: null,

  init: function (modal, $item, $itemLabel, $itemInput, sourceData) {
    this.modal = modal;
    this.$item = $item;
    this.$itemLabel = $itemLabel;
    this.$itemInput = $itemInput;
    this.sourceData = sourceData;

    this.$item.data('source', this);

    this.addListener(this.$item, 'click', 'select');
  },

  isHeading: function () {
    return false;
  },

  isSelected: function () {
    return this.modal.selectedSource === this;
  },

  select: function () {
    if (this.isSelected()) {
      return;
    }

    if (this.modal.selectedSource) {
      this.modal.selectedSource.deselect();
    }

    this.$item.addClass('sel');
    this.modal.selectedSource = this;

    if (!this.$settingsContainer) {
      this.$settingsContainer = this.createSettings().appendTo(
        this.modal.$sourceSettingsContainer
      );
    } else {
      this.$settingsContainer.removeClass('hidden');
    }

    this.modal.$sourceSettingsContainer.scrollTop(0);
  },

  createSettings: function () {
    return $('<div/>');
  },

  getIndexSource: function () {},

  deselect: function () {
    this.$item.removeClass('sel');
    this.modal.selectedSource = null;
    this.$settingsContainer.addClass('hidden');
  },

  updateItemLabel: function (val) {
    this.$itemLabel.text(val);
  },

  destroy: function () {
    this.$item.data('source', null);
    this.base();
  },
});

Craft.CustomizeSourcesModal.Source =
  Craft.CustomizeSourcesModal.BaseSource.extend({
    createSettings: function () {
      let $settings = $('<div/>').append(
        Craft.ui.createTextField({
          label: Craft.t('app', 'Header Column Heading'),
          id: 'defaultHeaderColHeading' + Math.floor(Math.random() * 100000),
          name: `sources[${this.sourceData.key}][headerColHeading]`,
          value: this.sourceData.headerColHeading,
          placeholder: this.sourceData.defaultHeaderColHeading,
        })
      );

      if (this.sourceData.tableAttributes.length) {
        $settings.append(this.createTableColumnsField());
      }

      return $settings;
    },

    createTableColumnsField: function () {
      // Create the title column option
      let [firstKey, firstLabel] = this.sourceData.tableAttributes[0];
      let $titleColumnCheckbox = this.createTableColumnOption(
        firstKey,
        firstLabel,
        true,
        true
      );

      // Create the rest of the options
      let $columnCheckboxes = $('<div/>');
      let selectedAttributes = [firstKey];

      $(
        '<input type="hidden" name="sources[' +
          this.sourceData.key +
          '][tableAttributes][]" value=""/>'
      ).appendTo($columnCheckboxes);

      // Add the selected columns, in the selected order
      for (let i = 1; i < this.sourceData.tableAttributes.length; i++) {
        let [key, label] = this.sourceData.tableAttributes[i];
        $columnCheckboxes.append(
          this.createTableColumnOption(key, label, false, true)
        );
        selectedAttributes.push(key);
      }

      // Add the rest
      let availableTableAttributes =
        this.modal.availableTableAttributes.slice(0);
      availableTableAttributes.push(
        ...this.sourceData.availableTableAttributes
      );

      for (let i = 0; i < availableTableAttributes.length; i++) {
        let [key, label] = availableTableAttributes[i];
        if (!Craft.inArray(key, selectedAttributes)) {
          $columnCheckboxes.append(
            this.createTableColumnOption(key, label, false, false)
          );
        }
      }

      new Garnish.DragSort($columnCheckboxes.children(), {
        handle: '.move',
        axis: 'y',
      });

      return Craft.ui.createField(
        $([$titleColumnCheckbox[0], $columnCheckboxes[0]]),
        {
          label: Craft.t('app', 'Table Columns'),
          instructions: Craft.t(
            'app',
            'Choose which table columns should be visible for this source, and in which order.'
          ),
        }
      );
    },

    createTableColumnOption: function (key, label, first, checked) {
      var $option = $('<div class="customize-sources-table-column"/>')
        .append('<div class="icon move"/>')
        .append(
          Craft.ui.createCheckbox({
            label: Craft.escapeHtml(label),
            name: 'sources[' + this.sourceData.key + '][tableAttributes][]',
            value: key,
            checked: checked,
            disabled: first,
          })
        );

      if (first) {
        $option.children('.move').addClass('disabled');
      }

      return $option;
    },

    getIndexSource: function () {
      var $source = this.modal.elementIndex.getSourceByKey(this.sourceData.key);

      if ($source) {
        return $source.closest('li');
      }
    },
  });

Craft.CustomizeSourcesModal.Heading =
  Craft.CustomizeSourcesModal.BaseSource.extend({
    $labelField: null,
    $labelInput: null,
    $deleteBtn: null,

    isHeading: function () {
      return true;
    },

    select: function () {
      this.base();
      this.$labelInput.trigger('focus');
    },

    createSettings: function () {
      let $settings = $('<div/>');

      this.$labelField = Craft.ui
        .createTextField({
          label: Craft.t('app', 'Heading'),
          instructions: Craft.t(
            'app',
            'This can be left blank if you just want an unlabeled separator.'
          ),
          value: this.sourceData.heading,
        })
        .appendTo($settings);

      this.$labelInput = this.$labelField.find('.text');

      $settings.append('<hr/>');

      this.$deleteBtn = $('<a class="error delete"/>')
        .text(Craft.t('app', 'Delete heading'))
        .appendTo($settings);

      this.addListener(this.$labelInput, 'input', 'handleLabelInputChange');
      this.addListener(this.$deleteBtn, 'click', 'deleteHeading');

      return $settings;
    },

    handleLabelInputChange: function () {
      this.updateItemLabel(this.$labelInput.val());
      this.modal.updateSourcesOnSave = true;
    },

    updateItemLabel: function (val) {
      this.$itemLabel.html(
        (val
          ? Craft.escapeHtml(val)
          : '<em class="light">' + Craft.t('app', '(blank)') + '</em>') +
          '&nbsp;'
      );
      this.$itemInput.val(val);
    },

    deleteHeading: function () {
      this.modal.sourceSort.removeItems(this.$item);
      this.modal.sources.splice($.inArray(this, this.modal.sources), 1);
      this.modal.updateSourcesOnSave = true;

      if (this.isSelected()) {
        this.deselect();

        if (this.modal.sources.length) {
          this.modal.sources[0].select();
        }
      }

      this.$item.remove();
      this.$settingsContainer.remove();
      this.destroy();
    },

    getIndexSource: function () {
      var label = this.$labelInput
        ? this.$labelInput.val()
        : this.sourceData.heading;
      return $('<li class="heading"/>').append($('<span/>').text(label));
    },
  });
