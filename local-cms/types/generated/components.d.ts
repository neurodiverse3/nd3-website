import type { Schema, Struct } from '@strapi/strapi';

export interface SiteFounder extends Struct.ComponentSchema {
  collectionName: 'components_site_founders';
  info: {
    description: '';
    displayName: 'founder';
  };
  attributes: {
    bio: Schema.Attribute.Text;
    ctaHref: Schema.Attribute.String;
    ctaLabel: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    photo: Schema.Attribute.Media<'images'>;
    role: Schema.Attribute.String;
  };
}

export interface SiteMemoirTeaser extends Struct.ComponentSchema {
  collectionName: 'components_site_memoir_teasers';
  info: {
    description: '';
    displayName: 'memoirTeaser';
  };
  attributes: {
    blurb: Schema.Attribute.Text;
    ctaHref: Schema.Attribute.String;
    ctaLabel: Schema.Attribute.String;
    headline: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'site.founder': SiteFounder;
      'site.memoir-teaser': SiteMemoirTeaser;
    }
  }
}
