package com.web.avent.controllers.home;

import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.web.avent.models.search.SearchModel;

import edu.emory.mathcs.backport.java.util.Collections;

@Controller
@RequestMapping({"/", "home"})
public class HomeController {

	private final Logger LOG = Logger.getLogger(HomeController.class);

	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView processGet() {
		LOG.trace("[GET] -- Home Controller" );
		return new ModelAndView("index");
	}

	@RequestMapping(value = "search", method = RequestMethod.GET)
	public ModelAndView processGetViewSearch() {
		LOG.trace("[GET] -- Home Controller - Search" );
		return new ModelAndView("views/searchresults");
	}

	@RequestMapping(value = "search/{text}", method = RequestMethod.GET)
	public ModelAndView processGetViewSearch(
			@PathVariable("text") final String text) {
		LOG.trace("[GET] -- Home Controller - Search" );
		final SearchModel searchModel = new SearchHandler().getSearchResults(text);
		return new ModelAndView("views/searchresults", "model", searchModel);
	}

	@RequestMapping(value = "calendar", method = RequestMethod.GET)
	public ModelAndView processGetViewCalendar() {
		LOG.trace("[GET] -- Home Controller - Calendar" );
		return new ModelAndView("views/calendar");
	}

	@RequestMapping(value = "autocomplete/{text}", method = RequestMethod.GET)
	@ResponseBody public Map<String, String> processGetAutoComplete(
			@PathVariable("text") final String text) {
		LOG.trace("[GET] -- Home Controller - Calendar" );
		return Collections.singletonMap("value", "test");
	}

}
