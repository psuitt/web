package com.web.avent.controllers.home;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping({"/", "home"})
public class HomeController {

	private final Logger LOG = Logger.getLogger(HomeController.class);

	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView processGet() {
		LOG.trace("[GET] -- Home Controller" );
		return new ModelAndView("index");
	}

}
