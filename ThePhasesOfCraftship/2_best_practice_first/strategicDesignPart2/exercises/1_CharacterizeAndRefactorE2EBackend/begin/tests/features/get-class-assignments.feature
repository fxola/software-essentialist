Feature: Get all assignments for a class

    As a teacher
    I want to get all assignments for a class
    So that I can view a list of all assignments for the class

    Scenario: Successfully fetch all assignments
        Given a class with assignments exists
        When I request all assignments for the class
        Then I should get a list of all assignments for the class

    Scenario: Fail to fetch assignments for a class that does not exist
        When I request all assignments for a non-existent class
        Then I should not get a list of assignments