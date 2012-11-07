package com.test.dao;

import java.util.List;

import com.test.model.Contact;

public interface IContactDAO {

	List<Contact> getContacts();
	
	void deleteContact(int id);
	
	Contact saveContact(Contact contact);
	
}
