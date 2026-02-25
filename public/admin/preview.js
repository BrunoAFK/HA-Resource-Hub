(function () {
  const { CMS, h, createClass } = window;

  if (!CMS || !h || !createClass) {
    return;
  }

  CMS.registerPreviewStyle('/admin/preview.css');

  const toJS = (value) => (value && typeof value.toJS === 'function' ? value.toJS() : value);

  const getCollectionName = (collection) => {
    if (!collection) return '';
    if (typeof collection.get === 'function') return collection.get('name') || '';
    return collection.name || '';
  };

  const buildPayload = (props) => {
    const { entry, collection } = props;
    return {
      type: 'decap-preview-update',
      collection: getCollectionName(collection),
      slug: (entry && typeof entry.get === 'function' && entry.get('slug')) || '',
      data: toJS(entry && typeof entry.getIn === 'function' ? entry.getIn(['data']) : {}) || {}
    };
  };

  const FullSitePreview = createClass({
    componentDidMount() {
      this.sendPreviewUpdate();
    },

    componentDidUpdate() {
      this.sendPreviewUpdate();
    },

    sendPreviewUpdate() {
      const iframe = this.frameRef;
      if (!iframe || !iframe.contentWindow) return;
      iframe.contentWindow.postMessage(buildPayload(this.props), window.location.origin);
    },

    render() {
      return h('div', { className: 'cms-site-preview' }, [
        h('iframe', {
          title: 'Full site preview',
          src: '/',
          className: 'cms-site-preview-frame',
          ref: (element) => {
            this.frameRef = element;
          },
          onLoad: () => this.sendPreviewUpdate()
        })
      ]);
    }
  });

  CMS.registerPreviewTemplate('site', FullSitePreview);
  CMS.registerPreviewTemplate('home', FullSitePreview);
  CMS.registerPreviewTemplate('integrations', FullSitePreview);
  CMS.registerPreviewTemplate('scripts', FullSitePreview);
  CMS.registerPreviewTemplate('projects', FullSitePreview);
})();
