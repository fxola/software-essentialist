Feature: Create Student

    As an administrator
    I want to create a Student 
    So that I can enrol them in a class

    Scenario: Sucessfully create a student
        Given I want to create a class room named "Lucas Moura" with email "Lmoura@gmail.com"
        When I send a request to create a student
        Then the student should be created successfully

    Scenario: Fail to create a student when name is not provided
        Given I want to create a student with no name but with email "Lmoura@gmail.com"
        When I send a request to create a student
        Then the student should not be created

    Scenario: Fail to create a student when email is not provided
        Given I want to create a student with no email, but with name "Lucas Moura"
        When I send a request to create a student
        Then the student should not be created

