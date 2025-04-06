package com.classteam.skopjetourismguide;

import lombok.Data;

public class TestLombok {
    public static void main(String[] args) {
        TestClass test = new TestClass();
        test.setName("Test");
        System.out.println(test.getName());
    }

    @Data
    static class TestClass {
        private String name;
    }
}