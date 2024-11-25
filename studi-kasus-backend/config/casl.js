import { Ability, AbilityBuilder } from '@casl/ability';

export const defineAbilitiesFor = (user) => {
  const { can, cannot, rules } = new AbilityBuilder(Ability);

  if (user.role === 'admin') {
    can('manage', 'all');
  } else {
    can('read', 'all');
  }

  return new Ability(rules);
};
