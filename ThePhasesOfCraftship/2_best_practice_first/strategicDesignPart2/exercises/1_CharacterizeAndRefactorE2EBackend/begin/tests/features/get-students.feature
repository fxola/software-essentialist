Feature: Get all students

    As an administrator
    I want to get all students
    So that I can view a list of all students

    Scenario: Successfully fetch all students
        Given students exist
        When I request all students
        Then I should get a list of all students