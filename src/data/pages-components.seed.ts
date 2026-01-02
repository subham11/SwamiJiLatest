// Page and Component content management structure
export interface ComponentContent {
  id: string;
  name: string;
  description: string;
  content: {
    [key: string]: string; // key-value pairs of editable text fields
  };
  lastModified?: Date;
}

export interface PageLayout {
  id: string;
  name: string;
  path: string;
  description: string;
  components: ComponentContent[];
}

export interface PagesComponentsData {
  [pageId: string]: PageLayout;
}

// Seed data with all pages and their components
export const getSeedPageComponents = (): PagesComponentsData => ({
  home: {
    id: 'home',
    name: 'Home',
    path: '/',
    description: 'Main landing page',
    components: [
      {
        id: 'hero',
        name: 'Hero Section',
        description: 'Main hero banner with parallax effect',
        content: {
          title: 'Welcome to Hanuman Divine',
          subtitle: 'Experience the power of ancient wisdom',
          cta_button: 'Get Started',
        },
        lastModified: new Date(),
      },
      {
        id: 'announcementBar',
        name: 'Announcement Bar',
        description: 'Top announcement banner',
        content: {
          message: 'New events coming soon!',
          icon: '📢',
        },
        lastModified: new Date(),
      },
      {
        id: 'sacredTeachings',
        name: 'Sacred Teachings',
        description: 'Display sacred teachings section',
        content: {
          section_title: 'Sacred Teachings',
          description: 'Explore the wisdom of the ancients',
        },
        lastModified: new Date(),
      },
      {
        id: 'upcomingEvents',
        name: 'Upcoming Events',
        description: 'Shows upcoming events list',
        content: {
          section_title: 'Upcoming Events',
          no_events_message: 'No events scheduled',
        },
        lastModified: new Date(),
      },
      {
        id: 'wordsOfWisdom',
        name: 'Words of Wisdom',
        description: 'Inspirational quotes section',
        content: {
          section_title: 'Words of Wisdom',
          subtitle: 'Daily inspirations',
        },
        lastModified: new Date(),
      },
    ],
  },
  'swamiji': {
    id: 'swamiji',
    name: 'About Swamiji',
    path: '/swamiji',
    description: 'Swamiji biography and teachings',
    components: [
      {
        id: 'swamiji-hero',
        name: 'Hero Section',
        description: 'Swamiji introduction',
        content: {
          title: 'Swamiji',
          subtitle: 'A life of devotion and wisdom',
          bio_intro: 'Welcome to the world of...',
        },
        lastModified: new Date(),
      },
      {
        id: 'swamiji-teachings',
        name: 'Teachings Section',
        description: 'Main teachings content',
        content: {
          section_title: 'Life and Teachings',
          intro_text: 'Swamiji dedicated his life to...',
        },
        lastModified: new Date(),
      },
    ],
  },
  'bajrang-baan': {
    id: 'bajrang-baan',
    name: 'Bajrang Baan',
    path: '/bajrang-baan',
    description: 'Sacred chanting and mantras page',
    components: [
      {
        id: 'bajrang-hero',
        name: 'Hero Section',
        description: 'Page introduction',
        content: {
          title: 'Bajrang Baan Abhiyan',
          subtitle: 'Collective chanting for divine connection',
        },
        lastModified: new Date(),
      },
      {
        id: 'bajrang-instructions',
        name: 'Instructions',
        description: 'How to participate',
        content: {
          intro: 'Join our community chanting',
          step_1: 'Step 1: Listen to the mantra',
          step_2: 'Step 2: Chant with devotion',
          step_3: 'Step 3: Share your experience',
        },
        lastModified: new Date(),
      },
    ],
  },
});

export const getPageById = (pageId: string): PageLayout | undefined => {
  const data = getSeedPageComponents();
  return data[pageId];
};

export const getAllPages = (): PageLayout[] => {
  return Object.values(getSeedPageComponents());
};

export const updateComponentContent = (
  pageId: string,
  componentId: string,
  updates: { [key: string]: string }
): PagesComponentsData => {
  const data = getSeedPageComponents();
  const page = data[pageId];
  if (!page) return data;

  const component = page.components.find(c => c.id === componentId);
  if (!component) return data;

  component.content = { ...component.content, ...updates };
  component.lastModified = new Date();

  return data;
};
