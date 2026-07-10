import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-ldapauth';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldapauth') {
  constructor() {
    super({
      server: {
        url: process.env.LDAP_URL || 'ldap://localhost:389',
        bindDN: process.env.LDAP_BIND_DN || '',
        bindCredentials: process.env.LDAP_BIND_CREDENTIALS || '',
        searchBase: process.env.LDAP_SEARCH_BASE || 'dc=example,dc=com',
        searchFilter: process.env.LDAP_SEARCH_FILTER || '(uid={{username}})',
        searchAttributes: ['uid', 'cn', 'mail'],
      },
    });
  }

  async validate(user: { uid: string; cn: string; mail: string }) {
    return {
      id: user.uid,
      nome: user.cn,
      email: user.mail,
    };
  }
}
