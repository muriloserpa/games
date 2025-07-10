import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable, Scope } from '@nestjs/common';
import { Game, User } from '@prisma/client';

export type PermActions = 'manage' | 'read' | 'create' | 'update' | 'delete';

export type PermResources = Subjects<{ User: User; Game: Game }> | 'all';

export type AppAblity = PureAbility<[PermActions, PermResources], PrismaQuery>;

export type DefinePermissions = (
  user: User,
  builder: AbilityBuilder<AppAblity>,
) => void;

const rolePermissionMap: Record<string, DefinePermissions> = {
  ADMIN(user, { can }) {
    can('manage', 'all');
  },
  USER(user, { can }) {
    can('read', 'User', { id: user.id });
    can('update', 'User', { id: user.id });
    can('delete', 'User', { id: user.id });
    can('manage', 'Game', { user_id: user.id });
  },
};

@Injectable({ scope: Scope.REQUEST })
export class CaslAbilityService {
  ability: AppAblity;
  createForUser(user: User) {
    const builder = new AbilityBuilder<AppAblity>(createPrismaAbility);
    rolePermissionMap[user.role](user, builder);
    this.ability = builder.build();
    return this.ability;
  }
}
