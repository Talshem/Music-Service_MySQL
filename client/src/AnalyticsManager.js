
import mixpanel from 'mixpanel-browser';
mixpanel.init(process.env.REACT_APP_MIXPANEL_KEY);

let actions = {
  identify: (id) => {
mixpanel.identify(id);
  },
  track: (name, props) => {
mixpanel.track(name, props);
  },
  people: {
    set: (props) => {
mixpanel.people.set(props);
    },
  },
};

export let Mixpanel = actions;